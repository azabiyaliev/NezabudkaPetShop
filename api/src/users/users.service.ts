import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as process from 'node:process';
import { regEmail, regPhone } from '../auth/auth.service';
import { CreateDto } from '../dto/user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async findPasswordResetRecordByToken(resetToken: string) {
    return this.prisma.passwordReset.findFirst({
      where: { resetToken },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  private async validateUser(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найдена`);
    }
    return user;
  }

  async resetPasswordByToken(userId: number, newPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Пароль успешно сброшен' };
  }

  async sendPasswordResetLink(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`Пользователь с таким email не найден`);
    }

    const resetToken: string = uuidv4();
    const resetLink = `${process.env.FRONTEND_URL}/change-password?token=${resetToken}`;

    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        resetToken,
        createdAt: new Date(),
      },
    });

    const emailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Сброс пароля',
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #344C3D;">🔐 Восстановление пароля</h2>
    <p style="font-size: 16px; color: #333;">
      Мы получили запрос на сброс пароля для вашего аккаунта. Если это были вы — перейдите по ссылке ниже:
    </p>
    <div style="text-align: center; margin: 30px 0;">
     <a href="${resetLink}">${resetLink}</a>
    </div>
    <p style="font-size: 14px; color: #666;">
      Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
    </p>
    <hr style="margin: 30px 0;" />
    <p style="font-size: 12px; color: #999;">
      С уважением,<br />
      Команда поддержки Nezabudka 🐾
    </p>
  </div>
`,
    };

    try {
      await this.transporter.sendMail(emailOptions);
    } catch (error) {
      console.error('Ошибка при отправке письма:', error);
      throw new Error('Ошибка при отправке письма');
    }

    return { message: 'Ссылка для сброса пароля отправлена на почту' };
  }

  async validateResetToken(
    userId: number,
    resetToken: string,
  ): Promise<boolean> {
    const record = await this.prisma.passwordReset.findFirst({
      where: {
        userId,
        resetToken,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
    });

    if (!record) {
      throw new NotFoundException(
        'Неверная ссылка или срок действия ссылки истек',
      );
    }

    return true;
  }

  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Неверный текущий пароль');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Пароль успешно изменен' };
  }

  async createAdmin(createDto: CreateDto) {
    const { email, firstName, secondName, password, role } = createDto;
    let phone = createDto.phone;

    if (password.includes(' ')) {
      throw new ConflictException('Пароль не должен содержать пустых отступов');
    }

    if (!regEmail.test(email)) {
      throw new BadRequestException('Неправильный формат для почты');
    }

    if (phone) {
      if (!regPhone.test(phone)) phone = phone.replace(/\s/g, '');
      if (!phone.startsWith('+996')) {
        phone = '+996' + phone.replace(/^0/, '');
      }
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    const existingPhone = phone
      ? await this.prisma.user.findUnique({ where: { phone } })
      : null;

    if (existingUser) {
      throw new ConflictException(
        `Пользователь с таким Email ${email} уже существует`,
      );
    }

    if (existingPhone) {
      throw new ConflictException(
        `Пользователь с таким номером ${phone} уже существует`,
      );
    }

    if (role === 'superAdmin') {
      const existingProtectedUser = await this.prisma.user.findFirst({
        where: { isProtected: true },
      });

      if (existingProtectedUser) {
        throw new ConflictException('Супер админ уже существует');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        secondName,
        password: hashedPassword,
        phone: phone?.trim() === '' ? null : phone,
        role: role ? role : undefined,
        token: crypto.randomUUID(),
      },
    });

    return { message: 'Админ создан успешно', user };
  }

  async findAll() {
    const result = await this.prisma.user.findMany();
    if (result.length === 0) {
      throw new NotFoundException('Пользователи не найдены');
    }
    return result;
  }

  async findSuperAdmin() {
    const result = await this.prisma.user.findFirst({
      where: {
        role: 'superAdmin',
        isProtected: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Суперадмин не найден');
    }

    return result;
  }

  async findALlAdmins() {
    const result = await this.prisma.user.findMany({
      where: { role: 'admin' },
    });

    if (!result) {
      throw new NotFoundException('Аккаунтов админа не найдено');
    }

    return result;
  }

  async findOneAdmin(id: string) {
    try {
      const parsId = parseInt(id);
      const user = await this.prisma.user.findFirst({
        where: { id: parsId },
      });

      if (!user) {
        throw new NotFoundException(`Пользователь с ID ${id} не найдена`);
      }

      return {
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };
    } catch (error) {
      console.error('findOne error:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`Пользователь с ID ${id} не найдена`);
      }
      return user;
    } catch (error) {
      console.error('findOne error:', error);
      throw error;
    }
  }

  async delete(id: string) {
    const parsId = parseInt(id);
    const user = await this.validateUser(parsId);

    if (user.role === 'superAdmin') {
      throw new ForbiddenException('Суперадмина нельзя удалить');
    }

    if (user.isProtected) {
      throw new ForbiddenException('Этот пользователь защищён от удаления');
    }

    await this.prisma.user.delete({ where: { id: parsId } });
    return { message: `Пользователь с таким ID ${id} удален успешно` };
  }

  async update(id: string, data: Partial<User>, currentUser: User) {
    const userId = parseInt(id);
    const user = await this.validateUser(userId);

    const isTargetSuperAdmin = user.role === 'superAdmin';
    const isRequesterSuperAdmin = currentUser.role === 'superAdmin';
    const isSelfEdit = currentUser.id === user.id;

    if (isTargetSuperAdmin && (!isRequesterSuperAdmin || !isSelfEdit)) {
      throw new ForbiddenException('У вас нет прав для редактирования');
    }

    if (data.password !== undefined) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password.toString(), salt);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}

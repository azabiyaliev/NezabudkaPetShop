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
import { RegisterDto } from '../dto/auth.dto';
import { regEmail, regPhone } from '../auth/auth.service';

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

  async findPasswordResetRecord(resetCode: string) {
    return this.prisma.passwordReset.findFirst({
      where: { resetCode: resetCode },
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

  async sendPasswordTheCode(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с таким email не найден`);
    }

    const existingResetCode = await this.prisma.passwordReset.findFirst({
      where: { userId: user.id },
    });

    if (existingResetCode) {
      await this.prisma.passwordReset.delete({
        where: { id: existingResetCode.id },
      });
    }

    const resetCode = Math.random().toString(36).substring(2, 8);

    const enailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Код для сброса пароля',
      text: `Ваш код для сброса пароля: ${resetCode}`,
    };

    try {
      await this.transporter.sendMail(enailOptions);
    } catch (error) {
      console.error('Ошибка при отправке письма:', error);
      throw new Error('Ошибка при отправке письма');
    }

    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        resetCode,
        createdAt: new Date(),
      },
    });

    return { message: 'Код отправлен на почту' };
  }

  async validateResetCode(userId: number, resetCode: string): Promise<boolean> {
    const record = await this.prisma.passwordReset.findFirst({
      where: { userId, resetCode },
    });

    if (!record) {
      throw new NotFoundException('Неверный код или срок действия кода истек');
    }
    const currentTime = new Date().getTime();
    const recordTime = new Date(record.createdAt).getTime();
    const expirationTime = 15 * 60 * 1000;

    if (currentTime - recordTime > expirationTime) {
      throw new NotFoundException('Неверный код или срок действия кода истек');
    }

    return true;
  }
  async updatePassword(
    userId: number,
    newPassword: string,
  ): Promise<{ message: string }> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Пароль успешно изменен' };
  }

  async createAdmin(registerDto: RegisterDto) {
    const { email, firstName, secondName, password, role } = registerDto;
    let phone = registerDto.phone;

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

  async findOne(id: string) {
    try {
      const parsId = parseInt(id);
      const user = await this.prisma.user.findFirst({
        where: { id: parsId },
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

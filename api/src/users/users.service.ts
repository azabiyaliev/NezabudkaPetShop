import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as process from 'node:process';

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
    console.log('пароль изменен');
  }

  async findAll() {
    const result = await this.prisma.user.findMany();
    if (result.length === 0) {
      throw new NotFoundException('Пользователи не найдены');
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
    await this.validateUser(parsId);

    await this.prisma.user.delete({ where: { id: parsId } });
    return { message: `Пользователь с таким ID ${id} удален успешно` };
  }

  async update(id: string, data: Partial<User>) {
    const userId = parseInt(id);

    await this.validateUser(userId);

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

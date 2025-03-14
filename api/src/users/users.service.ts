import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async validateUser(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найдена`);
    }
    return user;
  }

  async findAll() {
    const result = await this.prisma.user.findMany();
    if (result.length === 0) {
      throw new NotFoundException('Пользователи не найдены');
    }
    return result;
  }

  async findOne(id: string) {
    const parsId = parseInt(id);
    return this.validateUser(parsId);
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

    return { message: 'Данные успешно обновлены' };
  }
}

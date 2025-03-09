import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const result = await this.prisma.user.findMany();
    if (result.length === 0) {
      throw new NotFoundException('Users not found');
    }
    return result;
  }

  async findOne(id: string) {
    const parsId = parseInt(id);
    const user = await this.prisma.user.findFirst({ where: { id: parsId } });

    if (!user) {
      throw new NotFoundException(`User with this ${id} not found`);
    }
    return user;
  }

  async delete(id: string) {
    const parsId = parseInt(id);
    const user = await this.prisma.user.findFirst({ where: { id: parsId } });
    if (!user) {
      throw new NotFoundException(`User with this ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id: parsId } });
    return { message: `User with this ${id} deleted successfully` };
  }

  async update(id: string, data: Partial<User>) {
    const userId = parseInt(id);

    const existingUser = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with this ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async addFavorite(userId: number, productId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Пользователь с таким  ID не найден');
    }
    const findProduct = await this.prisma.products.findFirst({
      where: { id: productId },
    });

    if (!findProduct) {
      throw new BadRequestException('Продукт с таким  ID не найден');
    }
    return this.prisma.favorite.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
    });
  }

  async removeFavorite(userId: number, productId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Пользователь с таким  ID не найден');
    }
    const findProduct = await this.prisma.products.findFirst({
      where: { id: productId },
    });

    if (!findProduct) {
      throw new BadRequestException('Продукт с таким  ID не найден');
    }
    return this.prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    });
  }
}

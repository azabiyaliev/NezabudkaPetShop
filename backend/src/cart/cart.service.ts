import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartDto } from '../dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCarts() {
    const cart = await this.prisma.cart.findMany({
      orderBy: {
        id: 'desc',
      },
    });
    return cart || [];
  }

  async getOneCart(id: string) {
    const cartId = parseInt(id);
    const cart = await this.prisma.cart.findFirst({
      where: { id: cartId },
    });
    if (!cart) {
      throw new NotFoundException(`Бренд с id = ${id} не найдена!`);
    }
    return cart || null;
  }

  async createCartWithProducts(cartDTO: CartDto) {
    const { userId, anonymousCartId } = cartDTO;

    const cart = await this.prisma.cart.findFirst({
      where: {
        OR: [{ userId }, { anonymousCartId }],
      },
      include: {
        products: true,
      },
    });

    if (!cart) {
      const newCart = await this.prisma.cart.create({
        data: {
          userId,
          anonymousCartId,
        },
      });

      return { message: 'Корзина была успешно создана!', newCart };
    }

    return { message: 'Корзина была уже ранее создана!', cart };
  }
}

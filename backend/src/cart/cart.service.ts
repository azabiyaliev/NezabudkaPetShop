import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOneCart(token: string) {
    if (!token) {
      throw new NotFoundException(
        'Не предоставлены данные, необходимые для идентификации корзины.',
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { token },
    });

    if (!user) {
      throw new NotFoundException('Данный пользователь не найден!');
    }

    const cart = await this.prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        products: {
          include: {
            product: true,
          },
          orderBy: {
            productId: 'asc',
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Корзина не найдена!');
    }

    return cart;
  }

  async createCart(token: string) {
    if (!token) {
      throw new NotFoundException(
        'Данные не были предоставлены и корзина не может быть создана!',
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { token },
    });

    if (!user) {
      throw new NotFoundException('Данный пользователь не найден!');
    }

    const cart = await this.prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        products: true,
      },
    });

    if (!cart) {
      const newCart = await this.prisma.cart.create({
        data: {
          userId: user.id,
        },
        include: {
          products: true,
        },
      });

      return { message: 'Корзина была успешно создана!', newCart };
    }

    return { message: 'У вас корзина была уже ранее создана!', cart };
  }

  async deleteCart(id: number, token: string) {
    const cartId = id;

    if (!token) {
      throw new NotFoundException(
        'Не предоставлены данные, необходимые для идентификации корзины.',
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { token },
    });

    if (!user) {
      throw new NotFoundException('Данный пользователь не найден!');
    }

    const cart = await this.prisma.cart.findFirst({ where: { id: cartId } });

    if (!cart) {
      throw new NotFoundException(
        `Корзина с идентификатором равное ${id} не найдена!`,
      );
    }

    if (user.id === cart.userId) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      await this.prisma.cart.delete({ where: { id: cart.id } });
      return {
        message: 'Корзина успешно удалена!',
      };
    } else {
      throw new ForbiddenException(
        'Данная корзина не может быть удалена, так как она не принадлежит вам!',
      );
    }
  }
}

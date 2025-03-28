import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartDto } from '../dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}
  async getCard() {
    const carts = await this.prisma.customerCart.findMany({
      include: {
        product: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            secondName: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
    return carts || [];
  }
  async createCart(cartDTO: CartDto) {
    const { productId, quantity, token } = cartDTO;
    if (!productId || !quantity) {
      throw new NotFoundException(
        'Идентификатор продукта и количество товара не могут быть пустыми или равными 0!',
      );
    }
    let userIdn = null;
    let guestIdn = null;
    if (token) {
      const user = await this.prisma.user.findFirst({
        where: {
          token: token,
        },
      });
      if (user) {
        userIdn = user.id;
      }
    } else {
      const timestamp = Date.now();
      const randomPart = Math.floor(Math.random() * 100);
      guestIdn = Number(`${timestamp}${randomPart}`.toString().slice(0, 10));
    }
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(
        `Товар с идентификатором равное ${productId} не найден!`,
      );
    }
    return this.prisma.customerCart.create({
      data: {
        productId,
        quantity,
        userId: userIdn,
        guestId: guestIdn,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            secondName: true,
          },
        },
      },
    });
  }
  async updateCart(id: string, cartDto: CartDto) {
    const { quantity, token } = cartDto;
    if (!quantity) {
      throw new NotFoundException(
        'Количество товара не может быть пустым или равным 0!',
      );
    }
    const cartId = parseInt(id);
    const cart = await this.prisma.customerCart.findFirst({
      where: { id: cartId },
    });
    if (!cart) {
      throw new NotFoundException(
        `Корзина с идентификатором равное ${id} не найдена!`,
      );
    }
    let userIdn = null;
    let guestIdn = null;
    if (token) {
      const user = await this.prisma.user.findFirst({
        where: { token: token },
      });
      if (user) {
        userIdn = user.id;
      }
    } else {
      guestIdn = cart.guestId;
    }
    if (cart.userId !== userIdn || cart.guestId !== guestIdn) {
      throw new NotFoundException(
        'Вы не можете отредактировать чужую корзину!',
      );
    }
    const updateCart = await this.prisma.customerCart.update({
      where: { id: cartId },
      data: {
        quantity,
      },
    });
    return {
      updateCart,
      message: `Корзина с идентификатором равное ${cartId} успешно отредактирована`,
    };
  }
  async deleteCart(id: string) {
    const cartId = parseInt(id);
    const cart = await this.prisma.customerCart.findFirst({
      where: { id: cartId },
    });
    if (!cart) {
      throw new NotFoundException(
        `Корзина с идентификатором равное ${id} не найдена!`,
      );
    }
    await this.prisma.customerCart.delete({ where: { id: cartId } });
    return { message: 'Данная корзина была успешно удалена!' };
  }
  async deleteAllCarts() {
    await this.prisma.customerCart.deleteMany({});
    return { message: 'Корзина очищена!' };
  }
}

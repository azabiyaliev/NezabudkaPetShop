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
      },
    });
    return carts || [];
  }
  async createCart(cartDTO: CartDto) {
    const { productId, quantity } = cartDTO;
    if (!productId || !quantity) {
      throw new NotFoundException(
        'Идентификатор продукта и количество товара не могут быть пустыми или равными 0!',
      );
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
      },
    });
  }
  async updateCart(id: string, cartDto: CartDto) {
    const { productId, quantity } = cartDto;
    if (!productId || !quantity) {
      throw new NotFoundException(
        'Идентификатор продукта не может быть пустым, а также количество товара!',
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
    const updateCart = await this.prisma.customerCart.update({
      where: { id: cartId },
      data: {
        productId,
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
}

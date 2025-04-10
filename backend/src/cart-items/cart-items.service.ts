import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartItemDto } from '../dto/cart-item.dto';
import { CartDto } from '../dto/cart.dto';

@Injectable()
export class CartItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCartItem(id: number, cartItemDto: CartItemDto, token?: string) {
    const cartId = id;
    const { productId, quantity, anonymousCartId } = cartItemDto;
    let loginUserId = null;

    if (!token && !anonymousCartId) {
      throw new NotFoundException(
        'Не предоставлены данные, необходимые для идентификации корзины.',
      );
    }

    if (token) {
      const user = await this.prisma.user.findFirst({
        where: { token },
      });

      if (user) {
        loginUserId = user.id;
      } else {
        throw new NotFoundException('Данный пользователь не найден!');
      }
    }

    const cart = await this.prisma.cart.findFirst({
      where: { id: cartId },
      include: {
        products: true,
      },
    });

    if (!cart) {
      throw new NotFoundException(`Корзина не найдена!`);
    }

    const product = await this.prisma.products.findFirst({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Данный продукт не найден!');
    }

    const existingItemInCart = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });

    if (loginUserId && loginUserId === cart.userId) {
      if (existingItemInCart) {
        const item = await this.prisma.cartItem.update({
          where: { id: existingItemInCart.id },
          data: { quantity: existingItemInCart.quantity + quantity },
          include: { product: true },
        });
        return { message: 'Данный товар уже находится в корзине', item };
      }

      const item = await this.prisma.cartItem.create({
        data: { cartId, productId, quantity },
        include: { product: true },
      });
      return { message: 'Товар успешно добавлен в корзину', item };
    } else if (cart && cart.anonymousCartId === anonymousCartId) {
      if (existingItemInCart) {
        const item = await this.prisma.cartItem.update({
          where: { id: existingItemInCart.id },
          data: { quantity: existingItemInCart.quantity + quantity },
          include: { product: true },
        });
        return { message: 'Данный товар уже находится в корзине', item };
      }

      const item = await this.prisma.cartItem.create({
        data: { cartId, productId, quantity },
        include: { product: true },
      });
      return { message: 'Товар успешно добавлен в корзину', item };
    } else {
      throw new ForbiddenException(
        'Добавление товара невозможно — эта корзина принадлежит другому пользователю.',
      );
    }
  }

  async updateCartItem(
    cartId: number,
    productId: number,
    cartItemDto: CartItemDto,
    token?: string,
  ) {
    const { anonymousCartId } = cartItemDto;
    let loginUserId = null;

    if (!token && !anonymousCartId) {
      throw new NotFoundException(
        'Не предоставлены данные, необходимые для идентификации корзины.',
      );
    }

    if (token) {
      const user = await this.prisma.user.findFirst({
        where: { token },
      });

      if (user) {
        loginUserId = user.id;
      } else {
        throw new NotFoundException('Данный пользователь не найден!');
      }
    }

    const product = await this.prisma.products.findFirst({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден!');
    }

    const cart = await this.prisma.cart.findFirst({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException('Корзина не найдена!');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар в корзине не найден!');
    }

    if (cartItemDto.quantity <= 0) {
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });

      return { message: 'Товар удалён из корзины, так как количество = 0!' };
    }

    if (loginUserId && loginUserId === cart.userId) {
      return this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItemDto.quantity,
        },
        include: {
          product: true,
        },
      });
    } else if (cart && cart.anonymousCartId === anonymousCartId) {
      return this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItemDto.quantity,
        },
        include: {
          product: true,
        },
      });
    } else {
      throw new ForbiddenException(
        'К сожалению, вы не можете изменить данные этого товара, так как она закреплена за другим пользователем.',
      );
    }
  }

  async deleteCartItem(
    cartId: number,
    productId: number,
    cartDto: CartDto,
    token?: string,
  ) {
    let user = null;

    if (!token && !cartDto.anonymousCartId) {
      throw new NotFoundException(
        'Не предоставлены данные, необходимые для идентификации корзины.',
      );
    }

    if (token) {
      user = await this.prisma.user.findFirst({
        where: { token },
      });
    }

    if (!user) {
      throw new NotFoundException('Данный пользователь не найден!');
    }

    const cart = await this.prisma.cart.findFirst({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException('Корзина не найдена!');
    }

    const product = await this.prisma.products.findFirst({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден!');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар в корзине не найден!');
    }

    if (user && user.id === cart.userId) {
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
      return { message: 'Данный товар был успешно удален из корзины!' };
    } else if (cart && cart.anonymousCartId === cartDto.anonymousCartId) {
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
      return { message: 'Данный товар был успешно удален из корзины!' };
    } else {
      throw new ForbiddenException(
        'К сожалению, вы не можете удалить этот товар, так как она закреплена за другим пользователем.',
      );
    }
  }
}

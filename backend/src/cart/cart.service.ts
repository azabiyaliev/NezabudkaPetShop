import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartDto } from '../dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOneCart(id: string, cartDto: CartDto, token?: string) {
    const cartId = parseInt(id);
    const { anonymousCartId } = cartDto;
    let loginUserId = null;

    if (!token && !anonymousCartId) {
      throw new NotFoundException(
        'Не предоставлены данные, необходимые для идентификации корзины.',
      );
    }

    const cart = await this.prisma.cart.findFirst({
      where: { id: cartId },
      include: {
        products: true,
      },
    });

    if (!cart) {
      throw new NotFoundException(
        `Корзина с идентификатором равное ${id} не найдена!`,
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

    if (loginUserId) {
      if (cart.userId === loginUserId) {
        return { cart };
      }
    } else {
      if (cart.anonymousCartId && cart.anonymousCartId === anonymousCartId) {
        return { cart };
      }
    }

    return { message: 'У вас нет активной корзины!' };
  }

  async createCart(cartDTO: CartDto, token?: string) {
    const { anonymousCartId } = cartDTO;
    let loginUserId = null;

    if (!token && !anonymousCartId) {
      throw new NotFoundException(
        'Данные не были предоставлены и корзина не может быть создана!',
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

    const availableData = token ? { userId: loginUserId } : { anonymousCartId };

    const cart = await this.prisma.cart.findFirst({
      where: availableData,
      include: {
        products: true,
      },
    });

    if (!cart) {
      const newCart = await this.prisma.cart.create({
        data: {
          userId: loginUserId,
          anonymousCartId,
        },
        include: {
          products: true,
        },
      });

      return { message: 'Корзина была успешно создана!', newCart };
    }

    return { message: 'Корзина была уже ранее создана!', cart };
  }

  async deleteCart(id: string, cartDTO: CartDto, token?: string) {
    const cartId = parseInt(id);
    const { anonymousCartId } = cartDTO;

    if (!token && !anonymousCartId) {
      throw new NotFoundException(
        'Не предоставлены данные, необходимые для идентификации корзины.',
      );
    }

    const cart = await this.prisma.cart.findFirst({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException(
        `Корзина с идентификатором равное ${id} не найдена!`,
      );
    }

    let loginUserId = null;

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

    if (loginUserId) {
      if (cart.userId === loginUserId) {
        await this.prisma.cart.delete({ where: { id: cartId } });
        return {
          message: 'Корзина успешно удалена!',
        };
      }
    } else {
      if (cart.anonymousCartId && cart.anonymousCartId === anonymousCartId) {
        await this.prisma.cart.delete({ where: { id: cartId } });
        return { message: 'Корзина успешно удалена!' };
      }
    }

    throw new ForbiddenException(
      'Данная корзина не может быть удалена, так как она не принадлежит вам!',
    );
  }
}

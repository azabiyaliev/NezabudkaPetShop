import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../dto/createOrderDto';
import { OrderStatus } from '@prisma/client';

// const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;
// const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;
// const regAddress = /^[a-zA-Zа-яА-Я0-9\s,.-]+$/;

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders() {
    const order = await this.prisma.order.findMany({
      include: {
        user: true,
        items: true,
      },
    });
    return order;
  }

  async getUserOrders(userId?: number, guestEmail?: string) {
    if (!userId && !guestEmail) {
      throw new BadRequestException(
        'Необходим ID пользователя или email гостя',
      );
    }

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, phone: true, firstName: true },
      });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (orders.length === 0) {
        throw new NotFoundException('Заказы не найдены');
      }

      return { user, orders };
    }

    if (!guestEmail) {
      throw new BadRequestException('Email гостя обязателен');
    }

    const orders = await this.prisma.order.findMany({
      where: { guestEmail },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (orders.length === 0) {
      throw new NotFoundException('Заказы не найдены');
    }

    return orders;
  }

  async createOrder(createOrderDto: CreateOrderDto, userId?: number) {
    const {
      address,
      items,
      guestEmail,
      guestPhone,
      guestName,
      guestLastName,
      orderComment,
      paymentMethod,
    } = createOrderDto;

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }
    } else {
      if (!guestEmail || !guestPhone || !guestName) {
        throw new BadRequestException(
          'Для оформления заказа укажите имя, телефон и email',
        );
      }
    }

    const orderAmount = items.reduce(
      (acc, item) => acc + item.orderAmount * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        address,
        userId: userId || null,
        guestEmail: userId ? null : guestEmail,
        guestPhone: userId ? null : guestPhone,
        guestName: userId ? null : guestName,
        guestLastName: userId ? null : guestLastName,
        orderComment,
        paymentMethod,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            orderAmount,
          })),
        },
      },
      include: {
        items: true,
        user: true,
      },
    });
    return order;
  }

  async updateStatus(createOrderDto: CreateOrderDto, orderId: number) {
    const order = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: createOrderDto.status,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) {
      throw new BadRequestException(
        'Произошла ошибка при обновлении статуса товара',
      );
    }
    return order;
  }

  async deleteOrder(orderId: number) {
    const status = OrderStatus;

    if (status.Canceled) {
      await this.prisma.order.delete({
        where: {
          id: orderId,
          status: 'Canceled',
        },
      });
      return { message: 'Заказ был успешно удален' };
    }
  }
}

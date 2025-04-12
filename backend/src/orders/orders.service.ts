import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../dto/createOrderDto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private prisma: PrismaService,
    private telegramBot: TelegramService,
  ) {}

  async getAllOrders(query: { page: number; limit: number }) {
    const page = Number(query.page) || 1;
    const skip = (page - 1) * 10;
    const orders = await this.prisma.order.findMany({
      skip,
      take: 10,
      include: {
        user: true,
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
    const total = await this.prisma.order.count();
    return {
      data: orders,
      meta: {
        total,
        currentPage: page,
        lastPage: Math.ceil(total / 10),
        perPage: 10,
      },
    };
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

  async getOrderStats() {
    const stats = await this.prisma.orderStatistic.upsert({
      where: {
        id: 1,
      },
      create: { pickUpStatistic: 0, deliveryStatistic: 0 },
      update: {},
    });
    return stats;
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
      bonusUsed = 0,
      deliveryMethod,
    } = createOrderDto;

    let bonusToUse = 0;
    let personEmail = guestEmail;
    let personPhone = guestPhone;
    let personName = guestName;
    let user;

    if (userId) {
      user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      personEmail = guestEmail || user.email;
      personPhone = guestPhone || user.phone;
      personName = guestName || user.firstName;
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

    if (userId && bonusUsed > 0) {
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      if (bonusUsed > user.bonus) {
        throw new BadRequestException('Недостаточно бонусов');
      }

      bonusToUse = Math.min(orderAmount, bonusUsed);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          bonus: {
            decrement: bonusToUse,
          },
        },
      });
    }

    const finalAmount = orderAmount - bonusToUse;

    if (deliveryMethod === 'Delivery') {
      await this.prisma.orderStatistic.updateMany({
        where: { id: 1 },
        data: { deliveryStatistic: { increment: 1 } },
      });
    } else if (deliveryMethod === 'PickUp') {
      await this.prisma.orderStatistic.updateMany({
        where: { id: 1 },
        data: { pickUpStatistic: { increment: 1 } },
      });
    }

    const order = await this.prisma.order.create({
      data: {
        address: deliveryMethod === 'PickUp' ? 'Самовывоз' : address,
        userId: userId || null,
        guestEmail: personEmail,
        guestPhone: personPhone,
        guestName: personName,
        guestLastName: userId ? null : guestLastName,
        orderComment,
        paymentMethod,
        bonusUsed: bonusToUse,
        deliveryMethod,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            products: item.products,
            quantity: item.quantity,
            orderAmount: item.orderAmount * item.quantity,
          })),
        },
      },
      include: {
        items: true,
        user: true,
      },
    });

    let updatedUser = null;

    if (userId) {
      const bonusAmount = Math.floor(finalAmount * 0.01);

      updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          bonus: {
            increment: bonusAmount,
          },
        },
      });
    }

    try {
      const message = `
      Новый заказ: #${order.id}
      Адрес: ${order.address}
      Комментарий: ${order.orderComment || 'нет'}
      Способ оплаты: ${order.paymentMethod}
      Заказчик: ${order.guestName}
      Номер заказчика: ${order.guestPhone}
      Состав заказа:${items.map((item) => ` Номер: ${item.productId} - ${item.quantity}шт.  (${item.orderAmount} сом)`).join('\n')}
      Статус заказа: ${order.status}
      Условие доставки: ${order.deliveryMethod}
      Использовано бонусов: ${bonusToUse} сом
      Итого: ${orderAmount} сом;`;
      setTimeout(() => {
        this.telegramBot.sendMessage(message);
      }, 3000);
    } catch (e) {
      this.logger.error('Не удалось отправить уведомление в Telegram', e);
    }

    return {
      ...order,
      user: updatedUser || order.user,
    };
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

    if (createOrderDto.status === 'isDelivered') {
      const updateStats = order.items.map((item) =>
        this.prisma.products.update({
          where: { id: item.productId },
          data: {
            orderedProductsStats: {
              increment: item.quantity,
            },
          },
        }),
      );
      await Promise.all(updateStats);
    }

    if (createOrderDto.status === 'Canceled') {
      await this.prisma.order.delete({
        where: { id: orderId, status: 'Canceled' },
      });
      return { message: 'Заказ был отменен' };
    }
    return order;
  }
}

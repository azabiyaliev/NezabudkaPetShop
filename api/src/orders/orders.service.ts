import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../dto/createOrderDto';
import { OrderStatus } from '@prisma/client';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private prisma: PrismaService,
    private telegramBot: TelegramService,
  ) {}

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

    let personEmail = guestEmail;
    let personPhone = guestPhone;
    let personName = guestName;

    if (userId) {
      const user = await this.prisma.user.findUnique({
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

    const order = await this.prisma.order.create({
      data: {
        address,
        userId: userId || null,
        guestEmail: personEmail,
        guestPhone: personPhone,
        guestName: personName,
        guestLastName: userId ? null : guestLastName,
        orderComment,
        paymentMethod,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            products: item.products,
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
      Итого: ${orderAmount} сом;`;
      setTimeout(() => {
        this.telegramBot.sendMessage(message);
      }, 3000);
    } catch (e) {
      this.logger.error('Не удалось отправить уведомление в Telegram', e);
    }

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

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../dto/createOrderDto';
import { TelegramService } from '../telegram/telegram.service';
import { OrderStatus } from '@prisma/client';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private telegramBot: TelegramService,
  ) {}

  async getAllOrders(inProcessing = false) {
    const statusFilter = inProcessing
      ? {
          OR: [
            { status: OrderStatus.Pending },
            { status: OrderStatus.Confirmed },
            { status: OrderStatus.Packed },
            { status: OrderStatus.Shipped },
          ],
        }
      : {
          OR: [
            { status: OrderStatus.Delivered },
            { status: OrderStatus.Received },
            { status: OrderStatus.Canceled },
          ],
        };

    const orders = await this.prisma.order.findMany({
      where: statusFilter,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          isArchive: 'desc',
        },
      ],
    });

    return orders;
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

      return { user, orders };
    }

    if (guestEmail) {
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

      return orders;
    }
  }

  async transferGuestOrdersToUser(guestEmail: string, userId: number) {
    await this.prisma.order.updateMany({
      where: {
        guestEmail,
        userId: null,
      },
      data: {
        userId,
        guestEmail: null,
      },
    });

    return this.getUserOrders(userId);
  }

  async getOrderStats() {
    const stats = await this.prisma.statistic.upsert({
      where: {
        id: 1,
      },
      create: {
        totalOrders: 0,
        pickUpStatistic: 0,
        deliveryStatistic: 0,
        paymentByCard: 0,
        paymentByCash: 0,
        bonusUsage: 0,
        canceledOrderCount: 0,
        date: new Date(),
      },
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
      totalPrice,
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

      personEmail =
        guestEmail || (user.email && userId) ? null : createOrderDto.guestEmail;
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
      (acc, item) =>
        acc +
        (item.sales
          ? (item.promoPrice ?? 0) * (item.quantity ?? 1)
          : (item.productPrice ?? 0) * (item.quantity ?? 1)),
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
      await this.prisma.statistic.upsert({
        where: { id: 1 },
        update: { deliveryStatistic: { increment: 1 } },
        create: {
          id: 1,
          deliveryStatistic: 1,
          pickUpStatistic: 0,
          paymentByCard: 0,
          paymentByCash: 0,
          bonusUsage: 0,
          canceledOrderCount: 0,
          totalOrders: 0,
          date: new Date(),
        },
      });
    }

    if (deliveryMethod === 'PickUp') {
      await this.prisma.statistic.upsert({
        where: { id: 1 },
        update: { pickUpStatistic: { increment: 1 } },
        create: {
          id: 1,
          deliveryStatistic: 0,
          pickUpStatistic: 1,
          paymentByCard: 0,
          paymentByCash: 0,
          bonusUsage: 0,
          canceledOrderCount: 0,
          totalOrders: 0,
          date: new Date(),
        },
      });
    }

    if (paymentMethod === 'ByCard') {
      await this.prisma.statistic.upsert({
        where: { id: 1 },
        update: { paymentByCard: { increment: 1 } },
        create: {
          id: 1,
          deliveryStatistic: 0,
          pickUpStatistic: 0,
          paymentByCard: 1,
          paymentByCash: 0,
          bonusUsage: 0,
          canceledOrderCount: 0,
          totalOrders: 0,
          date: new Date(),
        },
      });
    }

    if (paymentMethod === 'ByCash') {
      await this.prisma.statistic.upsert({
        where: { id: 1 },
        update: { paymentByCash: { increment: 1 } },
        create: {
          id: 1,
          deliveryStatistic: 0,
          pickUpStatistic: 0,
          paymentByCard: 0,
          paymentByCash: 1,
          bonusUsage: 0,
          canceledOrderCount: 0,
          totalOrders: 0,
          date: new Date(),
        },
      });
    }

    if (bonusUsed) {
      await this.prisma.statistic.upsert({
        where: { id: 1 },
        update: { bonusUsage: { increment: 1 } },
        create: {
          id: 1,
          deliveryStatistic: 0,
          pickUpStatistic: 0,
          paymentByCard: 0,
          paymentByCash: 0,
          bonusUsage: 1,
          canceledOrderCount: 0,
          totalOrders: 0,
          date: new Date(),
        },
      });
    }

    if (createOrderDto.status === OrderStatus.Canceled) {
      await this.prisma.statistic.upsert({
        where: { id: 1 },
        update: {
          canceledOrderCount: { increment: 1 },
        },
        create: {
          id: 1,
          deliveryStatistic: 0,
          pickUpStatistic: 0,
          paymentByCard: 0,
          paymentByCash: 0,
          bonusUsage: 0,
          canceledOrderCount: 1,
          totalOrders: 0,
          date: new Date(),
        },
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
        totalPrice,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            products: item.products,
            quantity: item.quantity,
            orderAmount: orderAmount,
            productName: item.productName,
            productPrice: item.productPrice,
            promoPrice: item.promoPrice,
            promoPercentage: item.promoPercentage,
            sales: item.sales,
            productPhoto: item.productPhoto,
            productDescription: item.productDescription,
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
      await this.telegramBot.sendMessage(message);
    } catch (e) {
      this.logger.error('Не удалось отправить уведомление в Telegram', e);
    }

    if (order) {
      await this.prisma.statistic.upsert({
        where: { id: 1 },
        update: { totalOrders: { increment: 1 } },
        create: {
          id: 1,
          deliveryStatistic: 0,
          pickUpStatistic: 0,
          paymentByCard: 0,
          paymentByCash: 0,
          bonusUsage: 0,
          canceledOrderCount: 0,
          totalOrders: 1,
          date: new Date(),
        },
      });
    }

    return {
      ...order,
      user: updatedUser || order.userId,
    };
  }

  async updateStatus(updateStatus: UpdateStatusDto, orderId: number) {
    const order = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: updateStatus.status,
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

    if (updateStatus.status === 'Delivered') {
      const updateStats = order.items.map((item) => {
        if (item.productId !== null) {
          return this.prisma.products.update({
            where: { id: item.productId },
            data: {
              orderedProductsStats: {
                increment: item.quantity,
              },
            },
          });
        }
        return null;
      });
      await Promise.all(updateStats);

      await this.prisma.order.update({
        where: { id: orderId },
        data: { deliveredAt: new Date() },
      });
    }

    if (updateStatus.status === 'Canceled') {
      const telegramMessage = await this.telegramBot.sendMessage(
        `Заказ ${orderId} был отменен`,
      );
      return { telegramMessage, message: 'Заказ был отменен' };
    }
    return order;
  }

  async deleteOrder(orderId: number) {
    const status = OrderStatus;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    if (status.Delivered && status.Canceled && status.Received) {
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: { isArchive: !order.isArchive },
      });

      return {
        message: `Заказ успешно ${updatedOrder.isArchive ? 'архивирован' : 'разархивирован'}`,
        order: updatedOrder,
      };
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoDeletingOrder() {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    await this.prisma.order.updateMany({
      where: {
        status: OrderStatus.Delivered,
        deliveredAt: {
          lte: tenDaysAgo,
        },
      },
      data: {
        isArchive: true,
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoDeletingCanceledOrder() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    await this.prisma.order.updateMany({
      where: {
        status: OrderStatus.Canceled,
        createdAt: {
          lte: sevenDaysAgo,
        },
      },
      data: {
        isArchive: true,
      },
    });
  }
}

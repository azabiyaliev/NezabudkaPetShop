import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/createOrderDto';
import { CheckoutOrderDto } from './dto/checkoutOrderDto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  //FOR ADMIN
  async getAllOrders() {
    const orders = await this.prisma.order.findMany();
    if (orders.length === 0) {
      throw new NotFoundException('Список заказов пока что пуст');
    }
    return orders || [];
  }

  async getOneOrder(id: string) {
    if (!id) {
      throw new NotFoundException('id not found');
    }
    const oneOrder = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });
    if (!oneOrder) {
      throw new NotFoundException('Заказ не найден');
    }
    return oneOrder;
  }

  //FOR ADMIN/CLIENT
  async createOrder(
    userId: number,
    { productId, quantity, isDelivered, status }: CreateOrderDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true },
    });

    if (!user || (!user.email && !user.phone)) {
      throw new BadRequestException(
        'Для заказа требуется email или номер телефона.',
      );
    }

    const order = await this.prisma.order.create({
      data: {
        productId,
        quantity,
        isDelivered,
        userId,
        status: status || OrderStatus.inProcess,
      },
    });
    if (!order) {
      throw new BadRequestException('Произошла ошибка при заказе товара');
    }
    return order;
  }

  //FOR ADMIN
  async acceptOrder({ id }: CheckoutOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      throw new BadRequestException(`Заказ ${id} не найден`);
    }

    if (order.isDelivered) {
      throw new BadRequestException('Заказ уже доставлен');
    }

    const updatedOrder = await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status: 'isDelivered',
      },
    });

    if (!updatedOrder) {
      throw new BadRequestException(
        'Произошла ошибка при подтверждении доставленного товара',
      );
    }

    await this.prisma.products.update({
      where: {
        id: order.productId ?? undefined,
      },
      data: {
        purchasedProductCounter: {
          increment: order.quantity,
        },
      },
    });
    return { message: 'Доставка подтверждена', orderData: updatedOrder };
  }

  async orderStatus(id: string, status: OrderStatus) {
    const orderStatus = await this.prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status,
      },
    });

    if (!orderStatus) {
      throw new BadRequestException(
        'Произошла ошибка при обновлении статуса товара',
      );
    }

    if (status === OrderStatus.Canceled) {
      await this.prisma.order.delete({
        where: {
          id: id,
        },
      });
      return { message: 'Заказ был отменен' };
    }
    return orderStatus;
  }
}

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
    const orders = await this.prisma.orderItem.findMany({
      select: {
        id: true,
        order: true,
        products: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (orders.length === 0) {
      throw new NotFoundException('Список заказов пока что пуст');
    }
    return orders || [];
  }

  async getUserOrders() {
    const orders = await this.prisma.order.findMany({
      select: {
        id: true,
        user: true,
        orderItem: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (orders.length === 0) {
      throw new NotFoundException('Список заказов пока что пуст');
    }
    return orders || [];
  }

  async getOneOrder(id: number) {
    if (!id) {
      throw new NotFoundException('id not found');
    }
    const oneOrder = await this.prisma.orderItem.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        order: true,
        products: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
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
    { productId, quantity, status, orderId }: CreateOrderDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        phone: true,
      },
    });

    if (!user || (!user.email && !user.phone)) {
      throw new BadRequestException(
        'Для заказа требуется email или номер телефона.',
      );
    }

    const existingOrder = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        orderId,
      },
    });
    if (existingOrder) {
      const quantityIncrement = await this.prisma.orderItem.update({
        where: {
          id: existingOrder.id,
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
      return quantityIncrement;
    } else if (!existingOrder) {
      const order = await this.prisma.orderItem.create({
        data: {
          orderId,
          productId,
          quantity,
          status: status || OrderStatus.inProcess,
        },
        select: {
          id: true,
          order: true,
          products: true,
          quantity: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!order) {
        throw new BadRequestException('Произошла ошибка при заказе товара');
      }
      return existingOrder;
    }
  }

  //FOR ADMIN
  async acceptOrder({ id }: CheckoutOrderDto) {
    const order = await this.prisma.orderItem.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      throw new BadRequestException(`Заказ ${id} не найден`);
    }

    if (order.status === 'isDelivered') {
      throw new BadRequestException('Заказ уже доставлен');
    }

    const updatedOrder = await this.prisma.orderItem.update({
      where: {
        id,
      },
      data: {
        status: 'isDelivered',
      },
      select: {
        id: true,
        order: true,
        products: true,
        quantity: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!updatedOrder) {
      throw new BadRequestException(
        'Произошла ошибка при подтверждении доставленного товара',
      );
    }
    return { message: 'Доставка подтверждена', orderData: updatedOrder };
  }

  async orderStatus(id: number, status: OrderStatus) {
    const orderStatus = await this.prisma.orderItem.update({
      where: {
        id: id,
      },
      data: {
        status,
      },
      select: {
        id: true,
        order: true,
        products: true,
        quantity: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!orderStatus) {
      throw new BadRequestException(
        'Произошла ошибка при обновлении статуса товара',
      );
    }

    if (status === OrderStatus.Canceled) {
      await this.prisma.orderItem.delete({
        where: {
          id: id,
        },
      });
      return { message: 'Заказ был отменен' };
    }
    return orderStatus;
  }

  async deleteOrder(id: number) {
    const order = await this.prisma.orderItem.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!order) {
      throw new NotFoundException('Заказа не существует');
    }
    if (order.status !== 'isDelivered') {
      return {
        message: 'Заказ еще не доставлен, удаление невозможно',
      };
    } else if (order.status === 'isDelivered') {
      await this.prisma.orderItem.delete({
        where: {
          id,
        },
      });
      return { message: 'Заказ был доставлен и успешно удален' };
    }
  }
}

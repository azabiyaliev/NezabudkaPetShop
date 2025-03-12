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
    try {
      const orders = await this.prisma.order.findMany();
      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  async getOneOrder(id: string) {
    try {
      if (!id) {
        throw new NotFoundException('id not found');
      }
      const oneOrder = await this.prisma.order.findUnique({
        where: {
          id,
        },
      });
      return oneOrder;
    } catch (e) {
      throw new BadRequestException({ message: 'Not Found', e });
    }
  }

  //FOR ADMIN/CLIENT
  async createOrder(
    userId: number,
    { productId, quantity, isDelivered, status }: CreateOrderDto,
  ) {
    try {
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
      return order;
    } catch (e) {
      console.log(e);
    }
  }

  //FOR ADMIN
  async acceptOrder({ id }: CheckoutOrderDto) {
    try {
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
    } catch (e) {
      console.log(e);
    }
  }

  async orderStatus(id: string, status: OrderStatus) {
    try {
      const orderStatus = await this.prisma.order.update({
        where: {
          id: id,
        },
        data: {
          status,
        },
      });

      if (status === OrderStatus.Canceled) {
        await this.prisma.order.delete({
          where: {
            id: id,
          },
        });
        return { message: 'Заказ был отменен' };
      }
      return orderStatus;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}

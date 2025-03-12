import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../token.auth/token.role.guard';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { CreateOrderDto } from './dto/createOrderDto';
import { CheckoutOrderDto } from './dto/checkoutOrderDto';
import { AuthRequest } from '../types';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //FOR ADMINS
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('')
  async findAll() {
    try {
      const orders = await this.ordersService.getAllOrders();
      if (!orders) {
        return { message: 'Пока что нет заказов', data: orders };
      }
      return orders;
    } catch (e) {
      throw new BadRequestException({
        message: 'Не удалось получить заказы',
        e,
      });
    }
  }

  //FOR ADMINS
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const order = await this.ordersService.getOneOrder(id);
      return order;
    } catch (e) {
      console.log({ message: 'Этот заказ не найден', e });
    }
  }

  //FOR USERS && ADMIN
  @UseGuards(TokenAuthGuard)
  @Post('make_delivery')
  async createOrder(@Body() orderDto: CreateOrderDto, @Req() req: AuthRequest) {
    try {
      const userId = req.user.id;
      const makeOrder = await this.ordersService.createOrder(userId, orderDto);
      return makeOrder;
    } catch (e) {
      console.log({
        message: 'Произошла ошибка при заказе товара',
        e,
      });
    }
  }

  //FOR ADMIN
  // Req: http://localhost:8000/orders/cm84bik2g0002wkvj5jzdkgj9/approve_delivery
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/approve_delivery')
  async accessDelivery(@Param() id: CheckoutOrderDto) {
    try {
      const accessedDelivery = await this.ordersService.acceptOrder(id);
      if (!accessedDelivery) {
        throw new BadRequestException();
      }

      return accessedDelivery;
    } catch (e) {
      console.log(e);
    }
  }

  //FOR ADMINS
  @UseGuards(TokenAuthGuard)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    try {
      const updatedOrder = await this.ordersService.orderStatus(
        orderId,
        status,
      );
      return updatedOrder;
    } catch (e) {
      console.log({
        message: 'Ошибка при обновлении статуса заказа',
        e,
      });
    }
  }
}

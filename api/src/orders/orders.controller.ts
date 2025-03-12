import {
  Body,
  Controller,
  Delete,
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
    return await this.ordersService.getAllOrders();
  }

  //FOR ADMINS
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.getOneOrder(id);
  }

  //FOR USERS && ADMIN
  @UseGuards(TokenAuthGuard)
  @Post('make_delivery')
  async createOrder(@Body() orderDto: CreateOrderDto, @Req() req: AuthRequest) {
    const userId = req.user.id;
    return await this.ordersService.createOrder(userId, orderDto);
  }

  //FOR ADMIN
  // Req: http://localhost:8000/orders/cm84bik2g0002wkvj5jzdkgj9/approve_delivery
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/approve_delivery')
  async accessDelivery(@Param() id: CheckoutOrderDto) {
    return await this.ordersService.acceptOrder(id);
  }

  //FOR ADMINS
  @UseGuards(TokenAuthGuard)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    return await this.ordersService.orderStatus(orderId, status);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteDeliveredOrder(@Param('id') id: string) {
    return await this.ordersService.deleteOrder(id);
  }
}

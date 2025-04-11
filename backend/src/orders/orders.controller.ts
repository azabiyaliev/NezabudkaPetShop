import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/createOrderDto';
import { AuthRequest } from '../types';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all-orders')
  async findAll() {
    return await this.ordersService.getAllOrders();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Get('my-orders')
  async userOrders(@Req() req: AuthRequest) {
    const userId = req.user?.id;
    console.log(userId);
    if (!userId) {
      throw new UnauthorizedException('Необходима авторизация');
    }
    return await this.ordersService.getUserOrders(userId);
  }
  @Get('guest-orders')
  async guestOrder(@Query('email') guestEmail: string) {
    if (!guestEmail) {
      throw new BadRequestException('Email гостя обязателен');
    }
    return await this.ordersService.getUserOrders(undefined, guestEmail);
  }

  @UseGuards(TokenAuthGuard)
  @HttpCode(200)
  @Post('checkout')
  async registerOrder(
    @Body() orderDto: CreateOrderDto,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user?.id;
    return this.ordersService.createOrder(orderDto, userId);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() orderDto: CreateOrderDto,
  ) {
    return await this.ordersService.updateStatus(orderDto, Number(orderId));
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string) {
    return await this.ordersService.deleteOrder(Number(orderId));
  }
}

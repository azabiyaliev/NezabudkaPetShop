import {
  BadRequestException,
  Body,
  Controller,
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
import { UpdateStatusDto } from '../dto/update-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all-orders')
  async getAllOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.getAllOrders({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('statistics')
  async getStatistics() {
    return await this.ordersService.getOrderStats();
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

  @HttpCode(200)
  @Post('guest-checkout')
  async createGuestOrder(@Body() orderDto: CreateOrderDto) {
    try {
      return this.ordersService.createOrder(orderDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() orderDto: UpdateStatusDto,
  ) {
    return await this.ordersService.updateStatus(orderDto, Number(orderId));
  }
}

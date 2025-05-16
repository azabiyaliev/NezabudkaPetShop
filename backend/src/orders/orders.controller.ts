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
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/createOrderDto';
import { AuthRequest } from '../types';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { RecaptchaGuard } from '../recaptcha/recaptcha.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Get('all-orders')
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Get('statistics')
  async getStatistics() {
    return await this.ordersService.getOrderStats();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Get('client-orders')
  async getClientOrders(@Req() req: AuthRequest) {
    const userId = req.user?.id;
    if (userId) {
      return await this.ordersService.getUserOrders(userId);
    }
  }

  @Get('guest-orders')
  async getGuestOrders(@Query('guestEmail') guestEmail?: string) {
    return await this.ordersService.getUserOrders(undefined, guestEmail);
  }

  @Post('transfer-guest-orders')
  @UseGuards(TokenAuthGuard)
  async transferOrders(
    @Req() req: AuthRequest,
    @Body() body: { guestEmail: string },
  ) {
    return this.ordersService.transferGuestOrdersToUser(
      body.guestEmail,
      req.user.id,
    );
  }

  @UseGuards(TokenAuthGuard, RecaptchaGuard)
  @HttpCode(200)
  @Post('checkout')
  async registerOrder(
    @Body() orderDto: CreateOrderDto,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user?.id;
    return this.ordersService.createOrder(orderDto, userId);
  }

  @UseGuards(RecaptchaGuard)
  @HttpCode(200)
  @Post('guest-checkout')
  async createGuestOrder(@Body() orderDto: CreateOrderDto) {
    try {
      return this.ordersService.createOrder(orderDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(RolesGuard)
  @Roles('client', 'admin', 'superAdmin')
  @Patch(':id')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() orderDto: UpdateStatusDto,
  ) {
    return await this.ordersService.updateStatus(orderDto, Number(orderId));
  }

  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string) {
    return await this.ordersService.deleteOrder(Number(orderId));
  }
}

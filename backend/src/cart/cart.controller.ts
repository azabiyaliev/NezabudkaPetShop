import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthRequest, RequestUser } from '../types';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getOneCart(@Req() req: AuthRequest & { user: RequestUser }) {
    const token = req.cookies.token;
    if (token) {
      return await this.cartService.getOneCart(token);
    }
  }

  @Post()
  async create(@Req() req: AuthRequest & { user: RequestUser }) {
    const token = req.cookies.token;
    if (token) {
      return await this.cartService.createCart(token);
    }
  }

  @Delete(':id')
  async deleteCart(
    @Param('id') id: number,
    @Req() req: AuthRequest & { user: RequestUser },
  ) {
    const token = req.cookies.token;
    if (token) {
      return await this.cartService.deleteCart(id, token);
    }
  }
}

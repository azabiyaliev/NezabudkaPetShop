import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { RequestUser } from '../types';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getOneCart(@Req() req: Request & { user: RequestUser }) {
    const token = req.headers.authorization;
    if (token) {
      return await this.cartService.getOneCart(token);
    }
  }

  @Post()
  async create(@Req() req: Request & { user: RequestUser }) {
    const token = req.headers.authorization;
    if (token) {
      return await this.cartService.createCart(token);
    }
  }

  @Delete(':id')
  async deleteCart(
    @Param('id') id: number,
    @Req() req: Request & { user: RequestUser },
  ) {
    const token = req.headers.authorization;
    if (token) {
      return await this.cartService.deleteCart(id, token);
    }
  }
}

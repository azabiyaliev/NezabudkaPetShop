import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from '../dto/cart.dto';
import { RequestUser } from '../types';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCarts() {
    return await this.cartService.getCarts();
  }

  @Get(':id')
  async getOneCart(@Param('id') id: string) {
    return await this.cartService.getOneCart(id);
  }

  @Post()
  async create(
    @Req() req: Request & { user?: RequestUser },
    @Body() createCartDto: CartDto,
  ) {
    const token = req.headers.authorization;
    return await this.cartService.createCart(createCartDto, token);
  }

  @Delete(':id')
  async deleteBrand(
    @Param('id') id: string,
    @Req() req: Request & { user?: RequestUser },
    @Body() createCartDto: CartDto,
  ) {
    const token = req.headers.authorization;
    return await this.cartService.deleteCart(id, createCartDto, token);
  }
}

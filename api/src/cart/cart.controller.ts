import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
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
  async getCards() {
    return await this.cartService.getCard();
  }

  @Post()
  async createCart(
    @Body() cartDto: CartDto,
    @Req() req: Request & { user?: RequestUser },
  ) {
    if (!cartDto) {
      throw new NotFoundException('Данные не были предоставлены!');
    }
    const token = req.headers.authorization;
    return this.cartService.createCart({
      productId: cartDto.productId,
      quantity: cartDto.quantity,
      token,
    });
  }

  @Patch(':id')
  async updateCart(
    @Param('id') id: string,
    @Body() cartDto: CartDto,
    @Req() req: Request & { user?: RequestUser },
  ) {
    if (!cartDto) {
      throw new NotFoundException('Данные не были предоставлены!');
    }
    const token = req.headers.authorization;
    return await this.cartService.updateCart(id, {
      productId: cartDto.productId,
      quantity: cartDto.quantity,
      token,
    });
  }

  @Delete(':id')
  async deleteCart(@Param('id') id: string) {
    return await this.cartService.deleteCart(id);
  }

  @Delete()
  async deleteAllCarts() {
    return await this.cartService.deleteAllCarts();
  }
}

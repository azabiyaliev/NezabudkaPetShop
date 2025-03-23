import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from '../dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}
  @Get()
  async getCards() {
    return await this.cartService.getCard();
  }
  @Post()
  async createCart(@Body() cartDto: CartDto) {
    return this.cartService.createCart(cartDto);
  }
  @Put(':id')
  async updateCart(@Param('id') id: string, @Body() cartDto: CartDto) {
    return await this.cartService.updateCart(id, cartDto);
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

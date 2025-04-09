import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from '../dto/cart.dto';

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
  async create(@Body() createCartDto: CartDto) {
    return await this.cartService.createCartWithProducts(createCartDto);
  }
}

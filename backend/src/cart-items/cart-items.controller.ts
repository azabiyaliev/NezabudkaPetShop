import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemDto } from '../dto/cart-item.dto';
import { Request } from 'express';
import { RequestUser } from '../types';
import { CartDto } from '../dto/cart.dto';

@Controller('cart')
export class CartItemsController {
  constructor(private cartItemService: CartItemsService) {}

  @Post(':cartId/item')
  async createItem(
    @Req() req: Request & { user?: RequestUser },
    @Param('cartId') cartId: number,
    @Body() cartItemDto: CartItemDto,
  ) {
    const token = req.headers.authorization;
    return await this.cartItemService.createCartItem(
      cartId,
      cartItemDto,
      token,
    );
  }

  @Patch(':cartId/item/:productId')
  async updateItem(
    @Req() req: Request & { user?: RequestUser },
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
    @Body() cartItemDto: CartItemDto,
  ) {
    const token = req.headers.authorization;
    return await this.cartItemService.updateCartItem(
      cartId,
      productId,
      cartItemDto,
      token,
    );
  }

  @Delete(':cartId/item/:productId')
  async deleteItem(
    @Req() req: Request & { user?: RequestUser },
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
    @Body() cartDto: CartDto,
  ) {
    const token = req.headers.authorization;
    return await this.cartItemService.deleteCartItem(
      cartId,
      productId,
      cartDto,
      token,
    );
  }
}

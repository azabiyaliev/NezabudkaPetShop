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
import {AuthRequest, RequestUser} from '../types';

@Controller('cart')
export class CartItemsController {
  constructor(private cartItemService: CartItemsService) {}

  @Post(':cartId/item')
  async createItem(
    @Req() req: AuthRequest & { user: RequestUser },
    @Param('cartId') cartId: number,
    @Body() cartItemDto: CartItemDto,
  ) {
    const token = req.cookies.token;
    if (token) {
      return await this.cartItemService.createCartItem(
        cartId,
        cartItemDto,
        token,
      );
    }
  }

  @Patch(':cartId/item/:productId')
  async updateItem(
    @Req() req: AuthRequest & { user: RequestUser },
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
    @Body() cartItemDto: CartItemDto,
  ) {
    const token = req.cookies.token;
    if (token) {
      return await this.cartItemService.updateCartItem(
        cartId,
        productId,
        cartItemDto,
        token,
      );
    }
  }

  @Delete(':cartId/item/:productId')
  async deleteItem(
    @Req() req: AuthRequest & { user: RequestUser },
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
  ) {
    const token = req.cookies.token;
    if (token) {
      return await this.cartItemService.deleteCartItem(
        cartId,
        productId,
        token,
      );
    }
  }

  @Delete(':cartId/items')
  async deleteItems(
    @Req() req: AuthRequest & { user: RequestUser },
    @Param('cartId') cartId: number,
  ) {
    const token = req.cookies.token;
    if (token) {
      return await this.cartItemService.deleteCartItems(cartId, token);
    }
  }
}

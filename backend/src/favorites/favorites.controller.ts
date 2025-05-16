import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
  Query,
  Body,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { AuthRequest } from '../types';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(TokenAuthGuard)
  @Get()
  async getFavorites(@Req() req: AuthRequest) {
    const userId = req.user?.id;
    return this.favoritesService.getFavorites(userId);
  }

  @Get('by-id')
  async getFavorite(@Query('favoriteId') favoriteId: string) {
    return this.favoritesService.getFavoritesById(favoriteId);
  }

  @Post('merge')
  @UseGuards(TokenAuthGuard)
  async mergeLocalFavorites(
    @Body() dto: { productIds: number[] },
    @Req() req: AuthRequest,
  ) {
    return this.favoritesService.mergeFavorites(req.user.id, dto.productIds);
  }

  @UseGuards(TokenAuthGuard)
  @Post(':productId')
  async addFavorite(
    @Param('productId') productId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user?.id;
    return this.favoritesService.addFavorite(userId, Number(productId));
  }

  @UseGuards(TokenAuthGuard)
  @Delete(':productId')
  async removeFavorite(
    @Param('productId') productId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user?.id;
    return this.favoritesService.removeFavorite(userId, Number(productId));
  }
}

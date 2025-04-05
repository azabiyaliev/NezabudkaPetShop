import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { AuthRequest } from '../types';

@Controller('favorites')
@UseGuards(TokenAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(@Req() req: AuthRequest) {
    const userId = req.user?.id;
    return this.favoritesService.getFavorites(userId);
  }

  @Post(':productId')
  async addFavorite(
    @Param('productId') productId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user?.id;
    return this.favoritesService.addFavorite(userId, Number(productId));
  }

  @Delete(':productId')
  async removeFavorite(
    @Param('productId') productId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user?.id;
    return this.favoritesService.removeFavorite(userId, Number(productId));
  }
}

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { RolesGuard } from '../token.auth/token.role.guard';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { CreateReviewDto } from './review.dto';
import { AuthRequest } from '../types';

@Controller('reviews')
export class ReviewsController {
  constructor(private review: ReviewsService) {}

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'client')
  @Post()
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: AuthRequest,
  ) {
    const user = req.user;
    const firstName = req.user.firstName;
    const secondName = req.user.secondName;
    return await this.review.createReview(user.id, createReviewDto);
  }
}

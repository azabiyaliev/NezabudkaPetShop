import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { RolesGuard } from '../token.auth/token.role.guard';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { CreateReviewDto } from '../dto/review.dto';
import { AuthRequest } from '../types';
import { CreateCommentDto } from '../dto/comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private review: ReviewsService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'client')
  @Post('review')
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: AuthRequest,
  ) {
    const user = req.user;
    return await this.review.createReview(user.id, createReviewDto);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('delete/:id')
  async deleteReview(@Param('id') id: string) {
    return await this.review.deleteReview(id);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'client')
  @Post('comment')
  async addComment(
    @Body() commentDto: CreateCommentDto,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.id;
    return await this.review.addComment(userId, commentDto);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'client')
  @Put('comment/update/:id')
  async updateComment(
    @Param('id') id: string,
    @Body() commentDto: CreateCommentDto,
    @Req() req: AuthRequest,
  ) {
    const user = req.user;
    const comment = await this.prisma.comment.findFirst({
      where: { id: Number(id) },
    });
    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }
    if (user.role === 'admin' || comment.userId === user.id) {
      return await this.review.updateComment(id, commentDto);
    } else {
      throw new ForbiddenException(
        'У Вас нет прав для обновления данного комментария.',
      );
    }
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'client')
  @Delete('comment/delete/:id')
  async deleteComment(@Param('id') id: string, @Req() req: AuthRequest) {
    const user = req.user;
    const comment = await this.prisma.comment.findFirst({
      where: { id: Number(id) },
    });
    if (!comment) {
      throw new NotFoundException('Комментарий не найден.');
    }
    if (user.role === 'admin' || comment.userId === user.id) {
      return await this.review.deleteComment(id);
    } else {
      throw new ForbiddenException(
        'У Вас нет прав для удаления данного комментария.',
      );
    }
  }
}

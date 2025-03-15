import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: number, createReviewDto: CreateReviewDto) {
    const { productId, text, rating } = createReviewDto;
    if (!productId) {
      throw new BadRequestException('productId is missing in request');
    }
    const existingReview = await this.prisma.review.findFirst({
      where: { userId, productId },
    });
    if (existingReview) {
      await this.prisma.review.update({
        where: { id: existingReview.id },
        data: { rating: rating ?? existingReview.rating },
      });
    }
    const review = await this.prisma.review.create({
      data: {
        userId,
        productId,
        text: text || '',
        rating: rating || null,
      },
    });

    if (!review) {
      throw new BadRequestException('Произошла ошибка при сохранении отзыва.');
    }
    return review;
  }
}

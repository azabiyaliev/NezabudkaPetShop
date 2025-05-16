import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './review.dto';
import { CreateCommentDto } from './comment.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // Создает отзыв, можно оставить в виде рейтинга от 1 до 5, также можно добавить комментарий, можно обновить рейтинг.
  async createReview(userId: number, createReviewDto: CreateReviewDto) {
    const { productId, text, rating } = createReviewDto;
    if (!productId) {
      throw new NotFoundException(
        'Идентификатор продукта отсутствует в запросе',
      );
    }
    const productExists = await this.prisma.products.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      throw new NotFoundException(
        `Продукт с данным id - ${productId} не найден`,
      );
    }
    if (rating) {
      if (rating < 1 || rating > 5) {
        throw new BadRequestException('Рейтинг должен в диапозоне от 1 до 5.');
      }
    }
    if (text?.trim().length === 0) {
      throw new BadRequestException('Текст отзыва не должен быть пустым.');
    }
    const existingReview = await this.prisma.review.findFirst({
      where: { userId, productId },
    });
    if (existingReview) {
      return this.prisma.review.update({
        where: { id: existingReview.id },
        data: { rating },
      });
    }
    const review = await this.prisma.review.create({
      data: {
        userId,
        productId,
        text,
        rating,
      },
    });

    if (!review) {
      throw new BadRequestException('Произошла ошибка при сохранении отзыва.');
    }
    return review;
  }

  // Удаление отзыва.
  async deleteReview(id: string) {
    const reviewId = parseInt(id);
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId },
    });
    if (!review) {
      throw new BadRequestException(`Отзыв с id = ${id} не найден.`);
    }
    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Отзыв успешно удален', review };
  }

  // Создание комментария.
  async addComment(userId: number, commentDto: CreateCommentDto) {
    const { reviewId, comment } = commentDto;

    if (!reviewId) {
      throw new BadRequestException(
        'Идентификатор отзыва отсутствует в запросе',
      );
    }
    if (comment?.trim().length === 0) {
      throw new BadRequestException(
        'В тексте комментария не должно быть пустых отступов',
      );
    }
    if (comment && comment.length > 500) {
      throw new BadRequestException('Текст комментария слишком длинный.');
    }
    if (!commentDto) {
      throw new NotFoundException('Произошла ошибка при отправке комментария.');
    }
    const commentObj = await this.prisma.comment.create({
      data: {
        userId,
        reviewId,
        comment,
      },
    });
    if (!commentObj) {
      throw new BadRequestException('Произошла ошибка при сохранении отзыва.');
    }
    return commentObj;
  }

  // Обновление комментария.
  async updateComment(id: string, commentDto: CreateCommentDto) {
    const { comment } = commentDto;
    if (comment.trim().length === 0) {
      throw new BadRequestException('Текст комментария не должен быть пустым');
    }
    const commentId = parseInt(id);
    const commentObj = await this.prisma.comment.findFirst({
      where: { id: commentId },
    });
    if (!commentObj) {
      throw new NotFoundException(`Комментарий с данным id ${id} не найден.`);
    }
    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        comment,
      },
    });
  }

  // Удаление комментария
  async deleteComment(id: string) {
    const commentId = parseInt(id);
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId },
    });
    await this.prisma.comment.delete({ where: { id: commentId } });
    return { message: 'Комментарий успешно удален', comment };
  }
}

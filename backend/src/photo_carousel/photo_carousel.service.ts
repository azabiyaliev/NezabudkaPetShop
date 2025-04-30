import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PhotoByCarouselDto } from '../dto/photoCarousel.dto';

@Injectable()
export class PhotoCarouselService {
  constructor(private prisma: PrismaService) {}

  async getPhotos() {
    return this.prisma.photoByCarousel.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async createPhoto(photoDto: PhotoByCarouselDto) {
    if (!photoDto.title || !photoDto.description) {
      throw new BadRequestException('Не передан title или description');
    }

    return this.prisma.photoByCarousel.create({
      data: {
        photo: photoDto.photo,
        link: photoDto.link,
        title: photoDto.title,
        description: photoDto.description,
        order: photoDto.order ?? 0,
      },
    });
  }

  async updatePhoto(id: string, photoDto: PhotoByCarouselDto) {
    const { link, title, description, photo } = photoDto;

    const photoId = parseInt(id);

    const existingPhoto = await this.prisma.photoByCarousel.findFirst({
      where: { id: photoId },
    });

    if (!existingPhoto) {
      throw new NotFoundException('Фото не найдено');
    }

    return this.prisma.photoByCarousel.update({
      where: { id: photoId },
      data: {
        link,
        title,
        description,
        photo,
      },
    });
  }

  async deletePhoto(id: string) {
    const photoId = Number(id);
    if (isNaN(photoId)) {
      throw new BadRequestException('Некорректный ID');
    }

    const photo = await this.prisma.photoByCarousel.findFirst({
      where: { id: photoId },
    });
    if (!photo) {
      throw new NotFoundException(`Фото с id = ${id} не найдена!`);
    }

    await this.prisma.photoByCarousel.delete({ where: { id: photoId } });

    return { message: 'Данное фото было успешно удалено!' };
  }

  async updatePhotoOrder(photos: PhotoByCarouselDto[]) {
    const validPhotos = photos.filter((p) => p.id !== undefined) as {
      id: number;
      order: number;
    }[];

    if (validPhotos.length === 0) {
      throw new BadRequestException('Нет валидных фото для обновления');
    }

    const existingPhotos = await this.prisma.photoByCarousel.findMany({
      where: { id: { in: validPhotos.map((p) => p.id) } },
      select: { id: true },
    });

    const existingIds = new Set(existingPhotos.map((p) => p.id));
    const missingIds = validPhotos
      .map((p) => p.id)
      .filter((id) => !existingIds.has(id));

    if (missingIds.length) {
      throw new BadRequestException(
        `Фото с id ${missingIds.join(', ')} не найдены`,
      );
    }
    const orderValues = validPhotos.map((p) => p.order);
    const uniqueOrders = new Set(orderValues);
    if (uniqueOrders.size !== orderValues.length) {
      throw new BadRequestException('Дублирующиеся значения order');
    }
    return this.prisma.$transaction(
      validPhotos.map((photo) =>
        this.prisma.photoByCarousel.update({
          where: { id: photo.id },
          data: { order: photo.order },
        }),
      ),
    );
  }
}

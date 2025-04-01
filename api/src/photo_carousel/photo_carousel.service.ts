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
    if (!photoDto.photo || photoDto.photo.trim() === '') {
      throw new NotFoundException(
          `Фото не может быть путым полем!`,
      );
    }

    if (!photoDto.link || photoDto.link.trim() === '') {
      throw new NotFoundException(
          `Ссылка не может быть путым полем!`,
      );
    }
    return this.prisma.photoByCarousel.create({
      data: {
        ...photoDto,
      },
    });
  }

  async updatePhoto(
    id: string,
    photoDto: PhotoByCarouselDto,
    file?: Express.Multer.File,
  ) {
    const { link } = photoDto;
    let photo = photoDto.photo;

    if (file) {
      photo = '/photo_carousel/' + file.filename;
    }

    if (!photoDto.photo || photoDto.photo.trim() === '') {
      throw new NotFoundException(
        `Фото не может быть путым полем!`,
      );
    }

    if (!photoDto.link || photoDto.link.trim() === '') {
      throw new NotFoundException(
          `Ссылка не может быть путым полем!`,
      );
    }

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

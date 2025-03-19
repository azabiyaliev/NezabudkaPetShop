import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EditionSitedDto } from '../dto/editionsite.dto';

@Injectable()
export class EditionSiteService {
  constructor(private readonly prisma: PrismaService) {}

  async getSite() {
    return this.prisma.siteEdition.findFirst({
      include: {
        PhotoByCarousel: true,
      },
    });
  }

  async createInfoSite(editionDto: EditionSitedDto) {
    const {
      instagram,
      whatsapp,
      schedule,
      address,
      email,
      phone,
      PhotoByCarousel,
    } = editionDto;

    try {
      const photoData =
        PhotoByCarousel?.map((photoDto) => ({
          photo: photoDto.photo,
        })) || [];

      return await this.prisma.siteEdition.create({
        data: {
          instagram,
          whatsapp,
          schedule,
          address,
          email,
          phone,
          PhotoByCarousel: {
            create: photoData,
          },
        },
        include: {
          PhotoByCarousel: true,
        },
      });
    } catch (error) {
      console.error('Ошибка при создании записи в Prisma:', error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `${address} уже существует и вы не можете его повторно добавить!`,
        );
      }
      throw error;
    }
  }

  async updateSite(
    id: string,
    editionDto: EditionSitedDto,
    files?: { photo: string }[],
  ) {
    const { instagram, whatsapp, schedule, address, email, phone } = editionDto;
    const editId = parseInt(id);

    const editSite = await this.prisma.siteEdition.findUnique({
      where: { id: editId },
      include: { PhotoByCarousel: true },
    });

    if (!editSite) {
      throw new NotFoundException(`Сайт с id = ${id} не найден!`);
    }

    const newPhotoByCarousel = files
      ? files.map((file) => ({ photo: file.photo }))
      : editSite.PhotoByCarousel.map((photo) => ({ photo: photo.photo }));

    const photosToDelete = editSite.PhotoByCarousel.filter(
      (oldPhoto) =>
        !newPhotoByCarousel.some(
          (newPhoto) => newPhoto.photo === oldPhoto.photo,
        ),
    );

    const photosToAdd = newPhotoByCarousel.filter(
      (newPhoto) =>
        !editSite.PhotoByCarousel.some(
          (oldPhoto) => oldPhoto.photo === newPhoto.photo,
        ),
    );

    const photosToDeleteIds = photosToDelete.map((photo) => photo.id);

    return this.prisma.siteEdition.update({
      where: { id: editId },
      data: {
        instagram,
        whatsapp,
        schedule,
        address,
        email,
        phone,
        PhotoByCarousel: {
          deleteMany: {
            id: { in: photosToDeleteIds },
          },
          create: photosToAdd,
        },
      },
      include: {
        PhotoByCarousel: true,
      },
    });
  }
}

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
      files?: { id?: number; photo: string }[],
  ) {
    console.log('id:', id);
    console.log('FormData на сервере:', editionDto);
    console.log('files на сервере:', files);
    const { instagram, whatsapp, schedule, address, email, phone } = editionDto;
    const editId = parseInt(id);

    const editSite = await this.prisma.siteEdition.findUnique({
      where: { id: editId },
      include: { PhotoByCarousel: true },
    });

    if (!editSite) {
      throw new NotFoundException(`Сайт с id = ${id} не найден!`);
    }
    console.log('editSite.PhotoByCarousel:', editSite.PhotoByCarousel);

    const newPhotoByCarousel = [
      ...editSite.PhotoByCarousel.map((photo) => ({ id: photo.id, photo: photo.photo })),
      ...(files?.map((file) => ({ id: file.id, photo: file.photo })) || []),
    ];

    const photosToDelete = editSite.PhotoByCarousel.filter(
        (oldPhoto) =>
            !newPhotoByCarousel.some((newPhoto) => newPhoto.id === oldPhoto.id),
    );

    const photosToUpdate = newPhotoByCarousel.filter(
        (newPhoto) =>
            files?.some((file) => file.id === newPhoto.id) || (!files || files.length === 0), // Измененная логика
    );

    const photosToAdd = newPhotoByCarousel.filter(
        (newPhoto) =>
            !editSite.PhotoByCarousel.some((oldPhoto) => oldPhoto.id === newPhoto.id && oldPhoto.photo === newPhoto.photo),
    );

    const uniquePhotosToUpdate = Array.from(new Set(photosToUpdate.map(photo => photo.id)))
        .map(id => photosToUpdate.find(a => a.id === id));

    const uniquePhotosToAdd = Array.from(new Set(photosToAdd.map(photo => photo.id)))
        .map(id => photosToAdd.find(a => a.id === id))
        .filter(photo => photo !== undefined) as { id: number; photo: string }[]; // Фильтрация undefined и приведение типа

    const filteredPhotosToAdd = uniquePhotosToAdd.filter(photoToAdd => {
      return !uniquePhotosToUpdate.some(photoToUpdate => photoToUpdate?.id === photoToAdd.id); // Используем опциональную цепочку
    });


    console.log('uniquePhotosToUpdate', uniquePhotosToUpdate);
    console.log('uniquePhotosToAdd', uniquePhotosToAdd);

    console.log('Update', photosToUpdate);

    console.log('photosToAdd:', photosToAdd);

    console.log('Prisma update where:', { where: { id: parseInt(id) } });
    console.log('Prisma update data:', {
      instagram,
      whatsapp,
      schedule,
      address,
      email,
      phone,
      PhotoByCarousel: {
        delete: photosToDelete.map((photo) => ({ id: photo.id })),
        update: uniquePhotosToUpdate.map((photo) => ({
          where: { id: photo?.id },
          data: { photo: photo?.photo },
        })),
      },
    });

    uniquePhotosToUpdate.forEach((photo) => {
      console.log('Update photo id:', photo?.id);
      console.log('Update photo data:', {
        where: { id: photo?.id },
        data: { photo: photo?.photo },
      });
      console.log('New photo:', photo);
    });

    return this.prisma.siteEdition.update({
      where: { id: parseInt(id) },
      data: {
        instagram,
        whatsapp,
        schedule,
        address,
        email,
        phone,
        PhotoByCarousel: {
          delete: photosToDelete.map((photo) => ({ id: photo.id })),
          create: uniquePhotosToAdd.length ? uniquePhotosToAdd.map(photo => ({photo: photo.photo})) : undefined,// Используем uniquePhotosToAdd
          update: uniquePhotosToUpdate.map((photo) => ({ // Используем uniquePhotosToUpdate
            where: { id: photo?.id },
            data: { photo: photo?.photo },
          })),
        },
      },
      include: { PhotoByCarousel: true },
    });
  }
}

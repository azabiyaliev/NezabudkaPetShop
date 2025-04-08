import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoByCarouselDto } from '../dto/photoCarousel.dto';
import { PhotoCarouselService } from './photo_carousel.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as crypto from 'crypto';

@Controller('photos')
export class PhotoCarouselController {
  constructor(private readonly photoCarouselService: PhotoCarouselService) {}

  @Get()
  async getPhotos() {
    return this.photoCarouselService.getPhotos();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './public/photo_carousel',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          callback(null, `${crypto.randomUUID()}${imageFormat}`);
        },
      }),
    }),
  )
  async createPhoto(
    @Body() photoDto: PhotoByCarouselDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file && file.filename) {
      photoDto.photo = '/photo_carousel/' + file.filename;
    }
    return await this.photoCarouselService.createPhoto(photoDto);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './public/photo_carousel',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          callback(null, `${crypto.randomUUID()}${imageFormat}`);
        },
      }),
    }),
  )
  async updatePhoto(
    @Param('id') id: string,
    @Body() photoDto: PhotoByCarouselDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.photoCarouselService.updatePhoto(id, photoDto, file);
  }

  @Patch()
  async updatePhotoOrder(@Body() photos: PhotoByCarouselDto[]) {
    return await this.photoCarouselService.updatePhotoOrder(photos);
  }

  @Delete(':id')
  async deletePhoto(@Param('id') id: string) {
    return this.photoCarouselService.deletePhoto(id);
  }
}

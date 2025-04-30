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
import { diskStorage, memoryStorage } from 'multer';
import {
  ImageProcessorService,
  RESIZE_PRESETS,
} from '../common/image-processor.service';
import * as path from 'node:path';

@Controller('photos')
export class PhotoCarouselController {
  constructor(
    private readonly photoCarouselService: PhotoCarouselService,
    private readonly imageProcessorService: ImageProcessorService,
  ) {}

  @Get()
  async getPhotos() {
    return this.photoCarouselService.getPhotos();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
    }),
  )
  async createPhoto(
    @Body() photoDto: PhotoByCarouselDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const photoPath = await this.imageProcessorService.convertToWebP(
        file,
        './public/photo_carousel',
        'CAROUSEL',
      );
      photoDto.photo = photoPath;
    }
    return await this.photoCarouselService.createPhoto(photoDto);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './public/photo_carousel',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, 'CAROUSEL_' + Date.now() + ext);
        },
      }),
    }),
  )
  async updatePhoto(
    @Param('id') id: string,
    @Body() photoDto: PhotoByCarouselDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      photoDto.photo = '/photo_carousel/' + file.filename;
    }

    return this.photoCarouselService.updatePhoto(id, photoDto);
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

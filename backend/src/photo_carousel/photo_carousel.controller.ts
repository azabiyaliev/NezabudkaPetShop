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
import { memoryStorage } from 'multer';
import { ImageProcessorService, RESIZE_PRESETS } from '../common/image-processor.service';

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
        'CAROUSEL'
      );
      photoDto.photo = photoPath;
    }
    return await this.photoCarouselService.createPhoto(photoDto);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
    }),
  )
  async updatePhoto(
    @Param('id') id: string,
    @Body() photoDto: PhotoByCarouselDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const photoPath = await this.imageProcessorService.convertToWebP(
        file,
        './public/photo_carousel',
        'CAROUSEL'
      );
      photoDto.photo = photoPath;
    }
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

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as crypto from 'crypto';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';
import { EditionSiteService } from './editionsite.service';
import { EditionSitedDto } from '../dto/editionsite.dto';

@Controller('edition_site')
export class EditionSiteController {
  constructor(private editionSite: EditionSiteService) {}

  @Get()
  async getSiteData() {
    return await this.editionSite.getSite();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @UseInterceptors(
    FilesInterceptor('PhotoByCarousel', 10, {
      storage: diskStorage({
        destination: './public/editsite',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          callback(null, `${crypto.randomUUID()}${imageFormat}`);
        },
      }),
    }),
  )
  async createSite(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() editsiteDto: EditionSitedDto,
  ) {
    if (!editsiteDto) {
      throw new NotFoundException('Поля не были предоставлены!');
    }
    const photoData = files
      ? files.map((file) => ({
          photo: '/editsite/' + file.filename,
        }))
      : [];

    return await this.editionSite.createInfoSite({
      instagram: editsiteDto.instagram,
      whatsapp: editsiteDto.whatsapp,
      schedule: editsiteDto.schedule,
      address: editsiteDto.address,
      email: editsiteDto.email,
      phone: editsiteDto.phone,
      PhotoByCarousel: photoData,
    });
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('PhotoByCarousel', 10, {
      storage: diskStorage({
        destination: './public/editsite',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          callback(null, `${crypto.randomUUID()}${imageFormat}`);
        },
      }),
    }),
  )
  async updateSite(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() editsiteDto: EditionSitedDto,
  ) {
    if (!editsiteDto) {
      throw new NotFoundException('Поля не были предоставлены!');
    }

    const photoData = files
      ? files.map((file) => ({
          photo: '/editsite/' + file.filename,
        }))
      : [];
    return await this.editionSite.updateSite(id, editsiteDto, photoData);
  }
}

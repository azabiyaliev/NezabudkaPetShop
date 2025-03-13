import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as crypto from 'crypto';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';
import { EditionSiteService } from './editionsite.service';
import { EditionSitedDto } from './editionsite.dto';

@Controller('edition_site')
export class EditionSiteController {
  constructor(private editionSite: EditionSiteService) {}

  @Get(':id')
  async getBrand(@Param('id') id: string) {
    return await this.editionSite.getSiteById(id);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './public/editsite',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          callback(null, `${crypto.randomUUID()}${imageFormat}`);
        },
      }),
    }),
  )
  async createBrand(
    @UploadedFile() file: Express.Multer.File,
    @Body() editsiteDto: EditionSitedDto,
  ) {
    if (!editsiteDto) {
      throw new NotFoundException('Поля не были предоставлены!');
    }
    const logo = file ? '/editsite/' + file.filename : '';

    return await this.editionSite.createInfoSite({
      instagram: editsiteDto.instagram,
      whatsapp: editsiteDto.whatsapp,
      schedule: editsiteDto.schedule,
      address: editsiteDto.address,
      email: editsiteDto.email,
      phone: editsiteDto.phone,
      logo,
    });
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
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
    @UploadedFile() file: Express.Multer.File,
    @Body() editsiteDto: EditionSitedDto,
  ) {
    if (!editsiteDto) {
      throw new NotFoundException('Поля не были предоставлены!');
    }
    const logo = file ? file : undefined;

    return await this.editionSite.updateSite(id, editsiteDto, logo);
  }
}

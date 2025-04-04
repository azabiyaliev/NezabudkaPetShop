import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BrandDto } from '../dto/brands.dto';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';
import * as crypto from 'crypto';

@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  async getBrands() {
    return await this.brandsService.getBrands();
  }

  @Get(':id')
  async getBrand(@Param('id') id: string) {
    return await this.brandsService.getBrand(id);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './public/brands',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          callback(null, `${crypto.randomUUID()}${imageFormat}`);
        },
      }),
    }),
  )
  async createBrand(
    @UploadedFile() file: Express.Multer.File,
    @Body() brandDTO: BrandDto,
  ) {
    return await this.brandsService.createBrand(brandDTO, file);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './public/brands',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          callback(null, `${crypto.randomUUID()}${imageFormat}`);
        },
      }),
    }),
  )
  async updateBrand(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() brandDTO: BrandDto,
  ) {
    return await this.brandsService.updateBrand(id, brandDTO, file);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteBrand(@Param('id') id: string) {
    return await this.brandsService.deleteBrand(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BrandDto } from './brands.dto';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';

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
    if (!brandDTO) {
      throw new NotFoundException('Название и логотип бренда не был предоставлен!');
    }
    const logo = file && file.filename && '/brands/' + file.filename;
    return await this.brandsService.createBrand({
      title: brandDTO.title,
      logo,
    });
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
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
    if (!brandDTO) {
      throw new NotFoundException('Название и логотип бренда не был предоставлен!');
    }
    return await this.brandsService.updateBrand(id, brandDTO, file);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteBrand(@Param('id') id: string) {
    return await this.brandsService.deleteBrand(id);
  }
}

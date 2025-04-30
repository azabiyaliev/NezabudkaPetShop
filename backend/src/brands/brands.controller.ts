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
import { memoryStorage } from 'multer';
import { BrandDto } from '../dto/brands.dto';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';
import { ImageProcessorService } from '../common/image-processor.service';

@Controller('brands')
export class BrandsController {
  constructor(
    private brandsService: BrandsService,
    private imageProcessorService: ImageProcessorService,
  ) {}

  @Get()
  async getBrands() {
    return this.brandsService.getBrands();
  }

  @Get(':id')
  async getBrand(@Param('id') id: string) {
    return await this.brandsService.getBrand(id);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: memoryStorage(),
    }),
  )
  async createBrand(
    @UploadedFile() file: Express.Multer.File,
    @Body() brandDTO: BrandDto,
  ) {
    if (file) {
      const logoPath = await this.imageProcessorService.convertToWebP(
        file,
        './public/brands',
        'BRAND_LOGO',
      );
      file.filename = logoPath.split('/').pop() || '';
      brandDTO.logo = logoPath;
    }
    return await this.brandsService.createBrand(brandDTO);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: memoryStorage(),
    }),
  )
  async updateBrand(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() brandDTO: BrandDto,
  ) {
    if (file) {
      const logoPath = await this.imageProcessorService.convertToWebP(
        file,
        './public/brands',
        'BRAND_LOGO',
      );
      file.filename = logoPath.split('/').pop() || '';
      brandDTO.logo = logoPath;
    }
    return await this.brandsService.updateBrand(id, brandDTO, file);
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Delete(':id')
  async deleteBrand(@Param('id') id: string) {
    return await this.brandsService.deleteBrand(id);
  }
}

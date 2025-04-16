import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '../dto/category.dto';
import { SubcategoryDto } from '../dto/subCategoryDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import crypto from 'crypto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: './public/icon_category',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          callback(null, `${crypto.randomUUID()}${imageFormat}`);
        },
      }),
    }),
  )
  async createCategory(
    @Body() categoryDto: CategoryDto,
    @UploadedFile() icon?: Express.Multer.File,
  ) {
    const iconPath = icon ? `/icon_category/${icon.filename}` : null;
    return this.categoryService.createCategory({
      ...categoryDto,
      icon: iconPath,
    });
  }

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  async findOneCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getOneCategory(id);
  }

  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryDto: CategoryDto,
  ) {
    return this.categoryService.updateCategory(id, categoryDto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }

  @Get(':id/subcategories')
  async getSubcategories(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.getSubcategories(categoryId);
  }

  @Post(':id/subcategories')
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: './public/icon_category',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          callback(null, `${crypto.randomUUID()}${imageFormat}`);
        },
      }),
    }),
  )
  async addSubcategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() subCategoryDto: { subcategories: SubcategoryDto[] },
    @UploadedFile() icon?: Express.Multer.File,
  ) {
    const iconPath = icon ? `/icon_category/${icon.filename}` : null;

    const subcategoriesWithIcon = subCategoryDto.subcategories.map((sub) => ({
      ...sub,
      icon: iconPath,
    }));

    return this.categoryService.createSubcategory(id, subcategoriesWithIcon);
  }
  @Put(':id/parent')
  async updateSubcategoryParent(
    @Param('id') id: string,
    @Body() body: { parentId: number | null },
  ) {
    const subcategoryId = parseInt(id);
    return this.categoryService.updateSubcategoryParent(
      subcategoryId,
      body.parentId,
    );
  }
}

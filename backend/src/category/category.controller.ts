import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import * as crypto from 'crypto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Patch(':id/icon')
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: './public/category_icon',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          const fileName = `${crypto.randomUUID()}${imageFormat}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async addIconToCategory(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file && file.filename) {
      const filePath = '/category_icon/' + file.filename;

      await this.categoryService.addIconToCategory(id, filePath);

      return { success: true, icon: filePath };
    }
    throw new BadRequestException('Файл не был загружен');
  }

  @Post()
  async createCategory(@Body() categoryDto: CategoryDto) {
    return this.categoryService.createCategory(categoryDto);
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
  async addSubcategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() subCategoryDto: { subcategories: SubcategoryDto[] },
  ) {
    return this.categoryService.createSubcategory(
      id,
      subCategoryDto.subcategories,
    );
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

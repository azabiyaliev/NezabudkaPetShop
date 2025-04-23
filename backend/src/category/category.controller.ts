import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '../dto/category.dto';
import { SubcategoryDto } from '../dto/subCategoryDto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as crypto from 'crypto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './public/category',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          const fileName = `${crypto.randomUUID()}${imageFormat}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async createCategory(
    @Body() categoryDto: CategoryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const icon = files.find((f) => f.fieldname === 'icon');
    const image = files.find((f) => f.fieldname === 'image');

    categoryDto.icon = icon ? `/category/${icon.filename}` : null;
    categoryDto.image = image ? `/category/${image.filename}` : null;

    const savedCategory = await this.categoryService.createCategory(
      categoryDto,
      categoryDto.icon,
      categoryDto.image,
    );
    return savedCategory;
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
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './public/category',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          const fileName = `${crypto.randomUUID()}${imageFormat}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryDto: CategoryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const icon = files.find((f) => f.fieldname === 'icon');
    const image = files.find((f) => f.fieldname === 'image');

    categoryDto.icon = icon ? `/category/${icon.filename}` : null;
    categoryDto.image = image ? `/category/${image.filename}` : null;
    return this.categoryService.updateCategory(
      id,
      categoryDto,
      categoryDto.icon,
      categoryDto.image,
    );
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
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './public/category',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          const fileName = `${crypto.randomUUID()}${imageFormat}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async addSubcategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const subcategories: SubcategoryDto[] = [];

    let i = 0;
    while (body[`subcategories[${i}].title`]) {
      const title = (body as Record<string, string>)[
        `subcategories[${i}].title`
      ];
      const icon = files.find((f) => f.fieldname === `icon_${i}`);
      const image = files.find((f) => f.fieldname === `image_${i}`);

      subcategories.push({
        title,
        icon: icon ? `/category/${icon.filename}` : null,
        image: image ? `/category/${image.filename}` : null,
      });

      i++;
    }

    return this.categoryService.createSubcategory(id, subcategories);
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

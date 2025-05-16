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
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { CategoryDto } from '../dto/category.dto';
import { SubcategoryDto } from '../dto/subCategoryDto';
import { memoryStorage } from 'multer';
import { ImageProcessorService } from '../common/image-processor.service';

@Controller('category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private imageProcessorService: ImageProcessorService,
  ) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
    }),
  )
  async createCategory(
    @Body() categoryDto: CategoryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const image = files.find((f) => f.fieldname === 'image');
    if (image) {
      const imagePath = await this.imageProcessorService.convertToWebP(
        image,
        './public/category',
        'CATEGORY',
      );
      categoryDto.image = imagePath;
    }

    const savedCategory = await this.categoryService.createCategory(
      categoryDto,
      categoryDto.image || null,
    );
    return savedCategory;
  }

  @Get()
  async getAllCategories() {
    const categories = await this.categoryService.getAllCategories();
    return categories;
  }

  @Get(':id')
  async findOneCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getOneCategory(id);
  }

  @Put(':id')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
    }),
  )
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryDto: CategoryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const existingCategory = await this.categoryService.getOneCategory(id);
    const oldImage = existingCategory?.image;

    let newImage: string | null = oldImage ?? null;

    const imageFile = files.find((f) => f.fieldname === 'image');

    if (imageFile) {
      newImage = await this.imageProcessorService.convertToWebP(
        imageFile,
        './public/category',
        'CATEGORY',
      );
    } else if (categoryDto.image === null || categoryDto.image === '') {
      newImage = null;
    }

    return this.categoryService.updateCategory(id, {
      ...categoryDto,
      image: newImage,
    });
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
      storage: memoryStorage(),
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
      const imageFile = files.find((f) => f.fieldname === `image_${i}`);
      let imagePath = null;

      if (imageFile) {
        imagePath = await this.imageProcessorService.convertToWebP(
          imageFile,
          './public/category',
          'CATEGORY',
        );
      }

      subcategories.push({
        title,
        image: imagePath,
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

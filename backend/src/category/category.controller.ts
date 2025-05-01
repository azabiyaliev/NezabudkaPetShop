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
import {
  ImageProcessorService,
  ResizeOptions,
} from '../common/image-processor.service';

// Специфичные настройки для иконок категорий
const CATEGORY_ICON_OPTIONS: ResizeOptions = {
  width: 200,
  height: 200,
  fit: 'contain',
  quality: 90,
  withoutEnlargement: true,
};

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
    const icon = files.find((f) => f.fieldname === 'icon');
    const image = files.find((f) => f.fieldname === 'image');

    if (icon) {
      const iconPath = await this.imageProcessorService.convertToWebP(
        icon,
        './public/category',
        CATEGORY_ICON_OPTIONS,
      );
      categoryDto.icon = iconPath;
    }

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
      categoryDto.icon || null,
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
    const oldIcon = existingCategory?.icon;
    const oldImage = existingCategory?.image;

    let newIcon: string | null = oldIcon ?? null;
    let newImage: string | null = oldImage ?? null;

    const iconFile = files.find((f) => f.fieldname === 'icon');
    const imageFile = files.find((f) => f.fieldname === 'image');

    if (iconFile) {
      newIcon = await this.imageProcessorService.convertToWebP(
        iconFile,
        './public/category',
        CATEGORY_ICON_OPTIONS,
      );
    } else if (categoryDto.icon === null || categoryDto.icon === '') {
      newIcon = null;
    }

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
      icon: newIcon,
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
      const iconFile = files.find((f) => f.fieldname === `icon_${i}`);
      const imageFile = files.find((f) => f.fieldname === `image_${i}`);

      let iconPath = null;
      let imagePath = null;

      if (iconFile) {
        iconPath = await this.imageProcessorService.convertToWebP(
          iconFile,
          './public/category',
          CATEGORY_ICON_OPTIONS,
        );
      }

      if (imageFile) {
        imagePath = await this.imageProcessorService.convertToWebP(
          imageFile,
          './public/category',
          'CATEGORY',
        );
      }

      subcategories.push({
        title,
        icon: iconPath,
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

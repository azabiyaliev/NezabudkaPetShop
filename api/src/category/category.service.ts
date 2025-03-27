import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from '../dto/category.dto';
import { SubcategoryDto } from '../dto/subCategoryDto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private async validateCategory(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }
    return category;
  }

  async createCategory(categoryDto: CategoryDto) {
    const { title, parentId } = categoryDto;

    if (title.trim() === '') {
      throw new BadRequestException(
        'В названии не должно быть пустых отступов',
      );
    }

    if (parentId) {
      await this.validateCategory(parentId);
    }

    const newCategory = await this.prisma.category.create({
      data: { title, parentId: parentId ?? null },
    });

    return newCategory;
  }

  async createSubcategory(
    categoryId: number,
    subCategoryDtos: SubcategoryDto[],
  ) {
    categoryId = parseInt(categoryId.toString(), 10);
    await this.validateCategory(categoryId);

    for (const { title } of subCategoryDtos) {
      if (!title.trim()) {
        throw new BadRequestException('Название подкатегории отсутствует');
      }

      const existingSubcategory = await this.prisma.category.findFirst({
        where: { title, parentId: categoryId },
      });

      if (existingSubcategory) {
        throw new ConflictException(`Подкатегория "${title}" уже существует`);
      }

      await this.prisma.category.create({
        data: { title, parentId: categoryId },
      });
    }

    return { message: 'Подкатегории успешно добавлены' };
  }

  async getAllCategories() {
    const result = await this.prisma.category.findMany({
      where: { parentId: null },
      include: { subcategories: true },
    });

    if (result.length === 0) {
      throw new NotFoundException('Категории не найдены');
    }
    return result;
  }

  async getSubcategories(categoryId: number) {
    await this.validateCategory(categoryId);

    const subcategories = await this.prisma.category.findMany({
      where: { parentId: categoryId },
    });

    if (subcategories.length === 0) {
      throw new NotFoundException('Подкатегории не найдены');
    }

    return subcategories;
  }

  async getOneCategory(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { subcategories: true },
    });
  }

  async updateCategory(id: number, categoryDto: CategoryDto) {
    await this.validateCategory(id);

    await this.prisma.category.update({
      where: { id },
      data: { title: categoryDto.title },
    });

    return { message: 'Категория обновлена успешно' };
  }

  async deleteCategory(id: number) {
    await this.validateCategory(id);

    await this.prisma.category.delete({ where: { id } });

    return { message: 'Категория успешно удалена' };
  }
}

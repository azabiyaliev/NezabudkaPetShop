import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from '../dto/category.dto';
import { SubcategoryDto } from '../dto/subCategoryDto';

const predefinedSubcategories = [
  'Амуниция',
  'Ветеринарная аптека',
  'Витамины и добавки',
  'Влажный корм',
  'Сухой корм',
  'Домики и лежанки',
  'Ошейники и шлейки',
  'Лакомства',
  'Игрушки',
  'Сено',
];

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

  async createPredefinedSubcategories(categoryId: number) {
    await this.validateCategory(categoryId);

    for (const subcategory of predefinedSubcategories) {
      const existingSubcategory = await this.prisma.category.findFirst({
        where: { title: subcategory, parentId: categoryId },
      });

      if (!existingSubcategory) {
        await this.prisma.category.create({
          data: { title: subcategory, parentId: categoryId },
        });
      }
    }

    return { message: 'Предустановленные подкатегории добавлены успешно' };
  }

  async createCategory(categoryDto: CategoryDto) {
    const { title, parentId } = categoryDto;

    if (title.trim() === '') {
      throw new BadRequestException(
        'В названии не должно быть пустых отступов',
      );
    }

    const existingCategory = await this.prisma.category.findUnique({
      where: { title },
    });

    if (existingCategory) {
      throw new ConflictException('Категория с таким названием уже существует');
    }

    if (parentId) {
      await this.validateCategory(parentId);
    }

    const newCategory = await this.prisma.category.create({
      data: { title, parentId },
    });

    if (parentId === null) {
      await this.createPredefinedSubcategories(newCategory.id);
    }

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
        throw new ConflictException(
          'Подкатегория с таким названием уже существует',
        );
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

  async getOneCategory(parentId: string) {
    const parsId = parseInt(parentId);

    await this.validateCategory(parsId);

    return this.prisma.category.findMany({
      where: { id: parsId },
    });
  }

  async updateCategory(id: string, categoryDto: CategoryDto) {
    const parsId = parseInt(id);

    await this.validateCategory(parsId);

    await this.prisma.category.update({
      where: { id: parsId },
      data: {
        title: categoryDto.title,
      },
    });
    return { message: 'Категория обновлена успешно' };
  }

  async deleteCategory(id: string) {
    const parsId = parseInt(id);

    await this.validateCategory(parsId);

    await this.prisma.category.delete({
      where: { id: parsId },
    });
    return { message: 'Категория успешно удалена' };
  }
}

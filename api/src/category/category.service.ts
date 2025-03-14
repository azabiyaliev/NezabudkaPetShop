import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from '../dto/category.dto';

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

    const existingCategory = await this.prisma.category.findUnique({
      where: {
        title: title,
      },
    });

    if (existingCategory) {
      throw new ConflictException('Категория с таким названием уже существует');
    }

    if (parentId) {
      await this.validateCategory(parentId);
    }

    return this.prisma.category.create({
      data: { title, parentId },
    });
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

  async getAllSubCategories() {
    const result = await this.prisma.category.findMany({
      where: { parentId: { not: null } },
    });

    if (result.length === 0) {
      throw new NotFoundException('Подкатегории не найдены');
    }
    return result;
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

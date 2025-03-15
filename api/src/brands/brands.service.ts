import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BrandDto } from '../dto/brands.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBrands() {
    const brands = await this.prisma.brand.findMany({
      select: {
        products: true,
      },
    });
    return brands || [];
  }

  async getBrand(id: string) {
    const brandId = parseInt(id);
    const brand = await this.prisma.brand.findFirst({
      where: { id: brandId },
      select: { products: true },
    });
    if (!brand) {
      throw new NotFoundException(`Бренд с id = ${id} не найдена!`);
    }
    return brand;
  }

  async createBrand(brandDTO: BrandDto) {
    const { title, logo } = brandDTO;
    if (!title) {
      throw new NotFoundException('Название бренда не может быть пустым!');
    } else if (!logo) {
      throw new NotFoundException('Логотип бренда не может быть пустым!');
    }
    try {
      return await this.prisma.brand.create({
        data: {
          title,
          logo,
        },
        select: {
          id: true,
          title: true,
          logo: true,
          products: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `${title} уже существует и вы не можете его повторно добавить!`,
        );
      }
      throw error;
    }
  }

  async updateBrand(
    id: string,
    brandDTO: BrandDto,
    file?: Express.Multer.File,
  ) {
    const { title } = brandDTO;
    let logo = brandDTO.logo;
    if (file) {
      logo = '/brands/' + file.filename;
    }
    if (title.trim().length === 0 || logo.trim().length === 0) {
      throw new NotFoundException(
        `Название и логотип бренда не могут быть пустыми!`,
      );
    }
    const brandId = parseInt(id);
    const brand = await this.prisma.brand.findFirst({
      where: { id: brandId },
    });
    if (!brand) {
      throw new NotFoundException(`Бренд с id = ${id} не найдена!`);
    }
    return this.prisma.brand.update({
      where: { id: brandId },
      data: {
        title,
        logo,
      },
    });
  }

  async deleteBrand(id: string) {
    const brandId = parseInt(id);
    const brand = await this.prisma.brand.findFirst({ where: { id: brandId } });
    if (!brand) {
      throw new NotFoundException(`Бренд с id = ${id} не найдена!`);
    }
    await this.prisma.brand.delete({ where: { id: brandId } });
    return { message: 'Данный бренд был успешно удален!' };
  }
}

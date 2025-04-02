import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BrandDto } from '../dto/brands.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBrands() {
    const brands = await this.prisma.brand.findMany({
      orderBy: {
        id: 'desc',
      },
    });
    return brands || [];
  }

  async getBrand(id: string) {
    const brandId = parseInt(id);
    const brand = await this.prisma.brand.findFirst({
      where: { id: brandId },
    });
    if (!brand) {
      throw new NotFoundException(`Бренд с id = ${id} не найдена!`);
    }
    return brand;
  }

  async createBrand(brandDTO: BrandDto, file?: Express.Multer.File) {
    const { title, description } = brandDTO;
    const brand = await this.prisma.brand.findFirst({
      where: { title },
    });
    if (brand) {
      throw new NotFoundException(
        'Данный бренд уже существует и вы не можете повторно его добавить!',
      );
    }
    const newBrand = await this.prisma.brand.create({
      data: {
        title,
        logo: file && file.filename ? '/brands/' + file.filename : null,
        description: description === '' ? null : description,
      },
    });
    return { message: 'Новый бренд был успешно создан!', newBrand };
  }

  async updateBrand(
    id: string,
    brandDTO: BrandDto,
    file?: Express.Multer.File,
  ) {
    const { title, description } = brandDTO;
    const brandId = parseInt(id);
    const updateBrand: Partial<BrandDto> = {};

    const brand = await this.prisma.brand.findFirst({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException(
        `Бренд с идентификатором равное ${id} не найден!`,
      );
    }

    if (title !== brand.title) {
      const existingBrand = await this.prisma.brand.findFirst({
        where: { title: title },
      });
      if (existingBrand) {
        throw new ConflictException(
          `Бренд с названием "${title}" уже существует!`,
        );
      }
      updateBrand.title = title;
    }

    let logo = file ? '/brands/' + file.filename : null;
    if (file) {
      logo = '/brands/' + file.filename;
    }

    updateBrand.logo = logo;

    if (description !== brand.description || description === '') {
      updateBrand.description = description === '' ? null : description;
    }

    const changeBrand = await this.prisma.brand.update({
      where: { id: brandId },
      data: updateBrand,
    });

    return { message: 'Данный бренд был успешно отредактирован!', changeBrand };
  }

  async deleteBrand(id: string) {
    const brandId = parseInt(id);
    const brand = await this.prisma.brand.findFirst({ where: { id: brandId } });
    if (!brand) {
      throw new NotFoundException(
        `Бренд с идентификатором равное ${id} не найдена!`,
      );
    }
    await this.prisma.brand.delete({ where: { id: brandId } });
    return { message: 'Данный бренд был успешно удален!' };
  }
}

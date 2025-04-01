import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createBrand(brandDTO: BrandDto) {
    const { title, logo, description } = brandDTO;
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
        logo,
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
    let logo = file ? '/brands/' + file.filename : null;
    if (file) {
      logo = '/brands/' + file.filename;
    }
    const brandId = parseInt(id);
    const brand = await this.prisma.brand.findFirst({
      where: { id: brandId },
    });
    if (!brand) {
      throw new NotFoundException(
        `Бренд с идентификатором равное ${id} не найдена!`,
      );
    }
    const updateBrand = await this.prisma.brand.update({
      where: { id: brandId },
      data: {
        title,
        logo,
        description: description === '' ? null : description,
      },
    });
    return { message: 'Данный бренд был успешно отредактирован!', updateBrand };
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

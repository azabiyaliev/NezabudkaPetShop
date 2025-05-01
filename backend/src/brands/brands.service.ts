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
    return this.prisma.brand.findMany({
      orderBy: { id: 'desc' },
    });
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
    const { title, description } = brandDTO;
    const brand = await this.prisma.brand.findFirst({
      where: { title },
    });
    if (brand) {
      throw new ConflictException(
        'Данный бренд уже существует и вы не можете повторно его добавить!',
      );
    }
    const logo =
      brandDTO.logo === 'null' || brandDTO.logo === '' ? null : brandDTO.logo;
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

    if (file && brandDTO.logo) {
      updateBrand.logo = brandDTO.logo;
    } else if (brandDTO.logo === brand.logo) {
      updateBrand.logo = brandDTO.logo;
    } else if (!file || (brandDTO.logo != null && brandDTO.logo === '')) {
      updateBrand.logo = null;
    }

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

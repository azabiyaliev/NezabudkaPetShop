import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductsDto } from '../dto/createProductsDto';
import { ProductQueryDto } from './dto/querySearchDto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  //FOR ADMIN/USER
  async getAllProducts(query: ProductQueryDto) {
    const where: ProductQueryDto = {};

    if (query.categoryId) {
      where.categoryId = Number(query.categoryId);
    }

    if (query.brandId) {
      where.brandId = Number(query.brandId);
    }

    const products = await this.prismaService.products.findMany({
      where,
      select: {
        id: true,
        productName: true,
        productPhoto: true,
        productDescription: true,
        brand: true,
        category: true,
        sales: true,
        existence: true,
      },
    });
    return products || [];
  }

  //FOR ADMIN
  async addProduct(createProductsDto: CreateProductsDto) {
    const {
      productName,
      productDescription,
      productPhoto,
      productPrice,
      existence,
      sales,
      brandId,
      categoryId,
    } = createProductsDto;

    if (!brandId) {
      throw new BadRequestException({
        message: 'Заполните поле Бренда товара',
      });
    }

    if (!categoryId) {
      throw new BadRequestException({
        message: 'Заполните поле Категории товара',
      });
    }

    if (!productPhoto) {
      throw new BadRequestException({
        message: 'Поле с изображением товара не должно быть пустым ',
      });
    }

    const newProduct = await this.prismaService.products.create({
      data: {
        productName,
        productPhoto,
        productDescription,
        brandId: Number(brandId),
        categoryId: Number(categoryId),
        productPrice: Number(productPrice),
        sales,
        existence,
      },
      select: {
        id: true,
        productName: true,
        productPhoto: true,
        productDescription: true,
        brand: true,
        category: true,
        sales: true,
        existence: true,
      },
    });
    if (!newProduct) {
      throw new BadRequestException({
        message: 'Не удалось добавить товар в каталог товаров',
      });
    }
    return newProduct;
  }

  //FOR ADMIN/USER
  async getProductById(id: number) {
    const oneProduct = await this.prismaService.products.findUnique({
      where: {
        id,
      },
      include: {
        brand: true,
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                secondName: true,
              },
            },
            comments: {
              select: {
                id: true,
                comment: true,
                createdAt: true,
                user: {
                  select: {
                    firstName: true,
                    secondName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!oneProduct) {
      throw new BadRequestException('Товар не найден');
    }
    return oneProduct;
  }

  //FOR ADMIN
  async changeProductInfo(
    id: number,
    {
      productName,
      productDescription,
      productPrice,
      productPhoto,
      brandId,
      categoryId,
      existence,
      sales,
    }: CreateProductsDto,
  ) {
    const productId = await this.prismaService.products.findUnique({
      where: {
        id,
      },
    });

    if (!productId) {
      throw new NotFoundException('Товар не найден');
    }

    const changedProduct = await this.prismaService.products.update({
      where: {
        id,
      },
      data: {
        productName,
        productDescription,
        productPrice,
        productPhoto,
        brandId,
        categoryId,
        existence,
        sales,
      },
      select: {
        id: true,
        productName: true,
        productPhoto: true,
        productDescription: true,
        brand: true,
        category: true,
        sales: true,
        existence: true,
      },
    });
    if (!changedProduct) {
      throw new BadRequestException('Продукт не найден');
    }
    return changedProduct;
  }

  //FOR ADMIN
  async deleteProduct(id: number) {
    const productId = await this.prismaService.products.findUnique({
      where: {
        id,
      },
    });

    if (!productId) {
      throw new NotFoundException('Данный товар не найден');
    }

    await this.prismaService.products.delete({
      where: {
        id,
      },
    });
    return { message: 'Товар был успешно удалён!' };
  }
}

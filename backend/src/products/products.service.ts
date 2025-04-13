import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductsDto } from '../dto/createProductsDto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  //FOR ADMIN/USER
  async getAllProducts(searchKeyword?: string) {
    const products = await this.prismaService.products.findMany({
      where: {
        OR: [
          {
            productName: {
              contains: searchKeyword,
              mode: 'insensitive',
            },
          },
          {
            category: {
              title: {
                contains: searchKeyword,
                mode: 'insensitive',
              },
            },
          },
          {
            brand: {
              title: {
                contains: searchKeyword,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        brand: true,
        category: {
          select: {
            id: true,
            title: true,
            parentId: true,
            parent: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
    return products;
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
      startDateSales,
      endDateSales,
      productAge,
      productSize,
      productFeedClass,
      productWeight,
      productManufacturer,
    } = createProductsDto;

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
        productSize,
        productManufacturer,
        productFeedClass,
        productWeight: Number(productWeight) || null,
        productAge,
        brandId: Number(brandId) || null,
        categoryId: Number(categoryId),
        productPrice: Number(productPrice),
        sales: sales === 'true',
        existence: existence === 'true',
        startDateSales:
          startDateSales && startDateSales !== 'null' && startDateSales !== ''
            ? new Date(startDateSales)
            : null,
        endDateSales:
          endDateSales && endDateSales !== 'null' && endDateSales !== ''
            ? new Date(endDateSales)
            : null,
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
        startDateSales: true,
        endDateSales: true,
        productSize: true,
        productManufacturer: true,
        productFeedClass: true,
        productWeight: true,
        productAge: true,
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
        category: {
          include: {
            parent: true,
          },
        },
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

  async getOneProductForEdit(id: number) {
    const oneProduct = await this.prismaService.products.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        productName: true,
        productDescription: true,
        productSize: true,
        productManufacturer: true,
        productFeedClass: true,
        productWeight: true,
        productAge: true,
        brandId: true,
        categoryId: true,
        productPrice: true,
        sales: true,
        existence: true,
        startDateSales: true,
        endDateSales: true,
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
      startDateSales,
      endDateSales,
      productAge,
      productSize,
      productManufacturer,
      productFeedClass,
      productWeight,
    }: CreateProductsDto,
    file?: Express.Multer.File,
  ) {
    let photo = productPhoto;
    if (file) {
      photo = '/products/' + file.filename;
    }
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
        productPrice: Number(productPrice),
        productPhoto: photo,
        brandId: Number(brandId),
        categoryId: Number(categoryId),
        existence: existence === 'true',
        sales: sales === 'true',
        startDateSales:
          startDateSales && startDateSales !== 'null' && startDateSales !== ''
            ? new Date(startDateSales)
            : null,
        endDateSales:
          endDateSales && endDateSales !== 'null' && endDateSales !== ''
            ? new Date(endDateSales)
            : null,
        productWeight:
          productWeight === undefined || productWeight === null
            ? null
            : Number(productWeight),
        productAge: productAge === 'null' ? null : productAge,
        productSize: productSize === 'null' ? null : productSize,
        productManufacturer:
          productManufacturer === 'null' ? null : productManufacturer,
        productFeedClass: productFeedClass === 'null' ? null : productFeedClass,
      },
      select: {
        id: true,
        productName: true,
        productPhoto: true,
        productPrice: true,
        productDescription: true,
        brandId: true,
        categoryId: true,
        brand: true,
        category: true,
        sales: true,
        existence: true,
        startDateSales: true,
        endDateSales: true,
        productSize: true,
        productManufacturer: true,
        productFeedClass: true,
        productWeight: true,
        productAge: true,
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

  async getBrandsByCategoryId(id: number) {
    const subcategories = await this.prismaService.category.findMany({
      where: { parentId: id },
      include: {
        products: {
          include: { brand: true },
        },
      },
    });

    return subcategories.map((sub) => ({
      id: sub.id,
      title: sub.title,
      brands: Array.from(
        new Map(
          sub.products
            .filter((p) => p.brand)
            .map((p) => [p.brand!.id, p.brand]),
        ).values(),
      ),
    }));
  }
}

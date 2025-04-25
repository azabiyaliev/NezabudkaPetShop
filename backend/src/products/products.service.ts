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
  async getAllProducts(searchKeyword?: string, brand?: number) {
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
    if (brand) {
      const products = await this.prismaService.products.findMany({
        where: { brandId: brand },
      });
      return products || [];
    }
    return products;
  }

  async getPromotionalProducts() {
    const products = await this.prismaService.products.findMany({
      where: { sales: true },
      include: { brand: true, category: true },
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
      startDateSales,
      endDateSales,
      productAge,
      productSize,
      productFeedClass,
      productWeight,
      productManufacturer,
      originalPrice,
      promoPercentage,
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

    const original =
      originalPrice !== undefined
        ? Number(originalPrice)
        : Number(productPrice);
    let promoPrice = Number(promoPercentage);

    promoPrice =
      sales && promoPercentage ? original * (1 - promoPrice / 100) : original;

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
        productPrice: promoPrice,
        originalPrice: original,
        promoPercentage: Number(promoPercentage),
        sales,
        existence: existence === 'true',
        startDateSales,
        endDateSales,
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
        productPhoto: true,
        brandId: true,
        categoryId: true,
        productPrice: true,
        sales: true,
        existence: true,
        startDateSales: true,
        endDateSales: true,
        originalPrice: true,
        promoPercentage: true,
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
      promoPercentage,
      originalPrice,
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

    const original =
      originalPrice !== undefined
        ? Number(originalPrice)
        : (productId.originalPrice ?? Number(productPrice));
    let promoPrice = Number(promoPercentage);

    promoPrice =
      sales && promoPercentage ? original * (1 - promoPrice / 100) : original;

    const changedProduct = await this.prismaService.products.update({
      where: {
        id,
      },
      data: {
        productName,
        productDescription,
        productPrice: promoPrice,
        originalPrice: original,
        productPhoto: photo,
        brandId: Number(brandId),
        categoryId: Number(categoryId),
        existence: existence === 'true',
        sales: sales ? sales : false,
        startDateSales: sales ? startDateSales : null,
        endDateSales: sales ? endDateSales : null,
        productWeight:
          productWeight === undefined || productWeight === null
            ? null
            : Number(productWeight),
        productAge: productAge === 'null' ? null : productAge,
        productSize: productSize === 'null' ? null : productSize,
        productManufacturer:
          productManufacturer === 'null' ? null : productManufacturer,
        productFeedClass: productFeedClass === 'null' ? null : productFeedClass,
        promoPercentage: Number(promoPercentage),
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
        promoPercentage: true,
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

  async getCategoryFilterOptions(categoryId: number) {
    // Получаем все товары из категории
    const products = await this.prismaService.products.findMany({
      where: {
        OR: [
          { categoryId },
          {
            category: {
              parentId: categoryId,
            },
          },
        ],
      },
      include: {
        brand: true,
      },
    });

    if (!products || products.length === 0) {
      return {
        brands: [],
        sizes: [],
        ages: [],
        weights: [],
        foodClasses: [],
        manufacturers: [],
      };
    }

    // Извлекаем уникальные значения для всех атрибутов
    const brands = [
      ...new Set(
        products
          .filter((p) => p.brand !== null && p.brand !== undefined)
          .map((p) => (p.brand as any).title),
      ),
    ];
    const sizes = [
      ...new Set(
        products.filter((p) => p.productSize).map((p) => p.productSize),
      ),
    ];
    const ages = [
      ...new Set(products.filter((p) => p.productAge).map((p) => p.productAge)),
    ];
    const weights = [
      ...new Set(
        products.filter((p) => p.productWeight).map((p) => p.productWeight),
      ),
    ];
    const foodClasses = [
      ...new Set(
        products
          .filter((p) => p.productFeedClass)
          .map((p) => p.productFeedClass),
      ),
    ];
    const manufacturers = [
      ...new Set(
        products
          .filter((p) => p.productManufacturer)
          .map((p) => p.productManufacturer),
      ),
    ];

    // Находим минимальную и максимальную цену
    const prices = products.map((p) => p.productPrice);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 5000;

    return {
      brands,
      sizes,
      ages,
      weights,
      foodClasses,
      manufacturers,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
    };
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

  async getProductsByCategoryId(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('Категория не найдена');
    }

    let products;

    if (!category.parentId) {
      const subcategories = await this.prismaService.category.findMany({
        where: { parentId: id },
        select: { id: true },
      });

      const subcategoryId = subcategories.map((cat) => cat.id);

      subcategoryId.push(id);

      products = await this.prismaService.products.findMany({
        where: {
          categoryId: { in: subcategoryId },
        },
        include: {
          category: {
            include: {
              parent: true,
            },
          },
        },
      });
    } else {
      products = await this.prismaService.products.findMany({
        where: { categoryId: id },
        include: {
          category: {
            include: {
              parent: true,
            },
          },
        },
      });
    }

    return products;
  }

  async getFilteredProducts(categoryId: number, filters: any) {
    const {
      brands,
      sizes,
      ages,
      weights,
      foodClasses,
      manufacturers,
      minPrice,
      maxPrice,
      existence,
      sales,
    } = filters;

    // Строим условия WHERE для фильтрации
    const whereConditions: any = {
      OR: [
        { categoryId },
        {
          category: {
            parentId: categoryId,
          },
        },
      ],
    };

    // Фильтрация по бренду
    if (brands) {
      const brandValues = Array.isArray(brands) ? brands : [brands];
      whereConditions.brand = {
        title: {
          in: brandValues,
        },
      };
    }

    // Фильтрация по размеру
    if (sizes) {
      const sizeValues = Array.isArray(sizes) ? sizes : [sizes];
      whereConditions.productSize = {
        in: sizeValues,
      };
    }

    // Фильтрация по возрасту
    if (ages) {
      const ageValues = Array.isArray(ages) ? ages : [ages];
      whereConditions.productAge = {
        in: ageValues,
      };
    }

    // Фильтрация по весу
    if (weights) {
      const weightValues = Array.isArray(weights)
        ? weights.map(Number)
        : [Number(weights)];
      whereConditions.productWeight = {
        in: weightValues,
      };
    }

    // Фильтрация по классу корма
    if (foodClasses) {
      const foodClassValues = Array.isArray(foodClasses)
        ? foodClasses
        : [foodClasses];
      whereConditions.productFeedClass = {
        in: foodClassValues,
      };
    }

    // Фильтрация по производителю
    if (manufacturers) {
      const manufacturerValues = Array.isArray(manufacturers)
        ? manufacturers
        : [manufacturers];
      whereConditions.productManufacturer = {
        in: manufacturerValues,
      };
    }

    // Фильтрация по цене
    if (minPrice || maxPrice) {
      whereConditions.productPrice = {};

      if (minPrice) {
        whereConditions.productPrice.gte = Number(minPrice);
      }

      if (maxPrice) {
        whereConditions.productPrice.lte = Number(maxPrice);
      }
    }

    // Фильтрация по наличию
    if (existence === 'true') {
      whereConditions.existence = true;
    }

    // Фильтрация по акциям
    if (sales === 'true') {
      whereConditions.sales = true;
    }

    // Выполняем запрос с фильтрами
    const filteredProducts = await this.prismaService.products.findMany({
      where: whereConditions,
      include: {
        brand: true,
        category: true,
      },
    });

    return filteredProducts;
  }
}

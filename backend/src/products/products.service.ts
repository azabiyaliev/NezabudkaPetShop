import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductsDto } from '../dto/createProductsDto';

interface ProductFilters {
  brands?: string[] | string;
  sizes?: string[] | string;
  ages?: string[] | string;
  weights?: number[] | number | string[] | string;
  foodClasses?: string[] | string;
  manufacturers?: string[] | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  existence?: boolean | string;
  sales?: boolean | string;
}

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  //FOR ADMIN/USER
  async getAllProducts(searchKeyword?: string, brand?: number) {
    const products = await this.prismaService.products.findMany({
      orderBy: { id: 'desc' },
      where: {
        OR: [
          {
            productName: {
              contains: searchKeyword,
              mode: 'insensitive',
            },
          },
          {
            productCategory: {
              some: {
                category: {
                  title: {
                    contains: searchKeyword,
                    mode: 'insensitive',
                  },
                },
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
        productCategory: {
          include: {
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
      include: {
        brand: true,
        productCategory: {
          include: {
            category: {
              include: {
                parent: true,
              },
            },
          },
        },
      },
    });

    return products || [];
  }

  async getTopSellingProducts() {
    const products = await this.prismaService.products.findMany({
      where: {
        AND: [
          {
            orderedProductsStats: {
              gt: 0,
            },
          },
          {
            isBestseller: true,
          },
        ],
      },
      orderBy: {
        orderedProductsStats: 'desc',
      },
      take: 10,
      include: {
        brand: true,
        productCategory: {
          include: {
            category: {
              include: {
                parent: true,
              },
            },
          },
        },
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
      startDateSales,
      endDateSales,
      productAge,
      productSize,
      productFeedClass,
      productWeight,
      productManufacturer,
      promoPercentage,
      isBestseller,
    } = createProductsDto;

    if (!categoryId || categoryId.length === 0) {
      throw new BadRequestException({
        message: 'Заполните хотя бы одну категорию товара',
      });
    }

    if (!productPhoto) {
      throw new BadRequestException({
        message: 'Поле с изображением товара не должно быть пустым',
      });
    }

    const price = Number(productPrice);
    const promo = Number(promoPercentage);

    const promoFinalPrice =
      sales && promoPercentage
        ? Math.round(price - (price * promo) / 100)
        : null;

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
        productPrice: price,
        promoPrice: promoFinalPrice,
        promoPercentage: promo,
        sales,
        existence: existence === 'true',
        isBestseller: isBestseller === 'true',
        startDateSales,
        endDateSales,
        productCategory: {
          create: categoryId.map((id: number) => ({
            category: { connect: { id } },
          })),
        },
      },
      include: {
        brand: true,
        productCategory: {
          include: {
            category: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
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
        productCategory: {
          include: {
            category: {
              include: {
                parent: true,
              },
            },
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
      where: { id },
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
        productCategory: {
          select: {
            category: {
              select: {
                id: true,
              },
            },
          },
        },
        productPrice: true,
        sales: true,
        existence: true,
        isBestseller: true,
        startDateSales: true,
        endDateSales: true,
        promoPrice: true,
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
      isBestseller,
    }: CreateProductsDto,
    file?: Express.Multer.File,
  ) {
    let photo = productPhoto;
    if (file) {
      photo = '/products/' + file.filename;
    }

    const productExists = await this.prismaService.products.findUnique({
      where: { id },
    });
    if (!productExists) {
      throw new NotFoundException('Товар не найден');
    }

    const price = Number(productPrice);
    const promo = Number(promoPercentage);
    const promoFinalPrice =
      sales && promo ? Math.round(price - (price * promo) / 100) : null;

    return this.prismaService.products.update({
      where: { id },
      data: {
        productName,
        productDescription,
        productPrice: price,
        promoPrice: promoFinalPrice,
        productPhoto: photo,
        brandId: Number(brandId),
        existence: existence === 'true',
        sales: sales ?? false,
        isBestseller: isBestseller === 'true',
        startDateSales: sales ? startDateSales : null,
        endDateSales: sales ? endDateSales : null,
        productWeight: productWeight ? Number(productWeight) : null,
        productAge: productAge === 'null' ? null : productAge,
        productSize: productSize === 'null' ? null : productSize,
        productManufacturer:
          productManufacturer === 'null' ? null : productManufacturer,
        productFeedClass: productFeedClass === 'null' ? null : productFeedClass,
        promoPercentage: promo,

        productCategory: {
          deleteMany: {},
          create: categoryId.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
      include: {
        brand: true,
        productCategory: {
          include: {
            category: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });
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

    await this.prismaService.cartItem.deleteMany({
      where: {
        productId: id,
      },
    });

    await this.prismaService.productCategory.deleteMany({
      where: { productId: id },
    });

    await this.prismaService.cartItem.deleteMany({
      where: { productId: id },
    });

    await this.prismaService.favorite.deleteMany({
      where: { productId: id },
    });

    await this.prismaService.products.delete({
      where: {
        id,
      },
    });

    return { message: 'Товар был успешно удалён!' };
  }

  async getCategoryFilterOptions(categoryId: number) {
    const productsWithCategory =
      await this.prismaService.productCategory.findMany({
        where: {
          categoryId,
        },
        include: {
          product: {
            include: {
              brand: true,
            },
          },
        },
      });

    const products = productsWithCategory.map((entry) => entry.product);

    if (products.length === 0) {
      return {
        brands: [],
        sizes: [],
        ages: [],
        weights: [],
        foodClasses: [],
        manufacturers: [],
      };
    }

    const brands = [
      ...new Set(
        products.filter((p) => p.brand?.title).map((p) => p.brand!.title),
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
        productCategory: {
          include: {
            product: {
              include: {
                brand: true,
              },
            },
          },
        },
      },
    });

    return subcategories.map((sub) => ({
      id: sub.id,
      title: sub.title,
      brands: Array.from(
        new Map(
          sub.productCategory
            .map((pc) => pc.product?.brand)
            .filter((brand) => brand)
            .map((brand) => [brand!.id, brand!]),
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

    let categoryIds: number[] = [];

    if (!category.parentId) {
      const subcategories = await this.prismaService.category.findMany({
        where: { parentId: id },
        select: { id: true },
      });

      categoryIds = subcategories.map((cat) => cat.id);
      categoryIds.push(id);
    } else {
      categoryIds = [id];
    }

    const productCategories = await this.prismaService.productCategory.findMany(
      {
        where: {
          categoryId: { in: categoryIds },
        },
        include: {
          product: {
            include: {
              brand: true,
              productCategory: {
                include: {
                  category: {
                    include: { parent: true },
                  },
                },
              },
            },
          },
        },
      },
    );

    const uniqueProducts = new Map<
      number,
      (typeof productCategories)[0]['product']
    >();

    for (const pc of productCategories) {
      uniqueProducts.set(pc.product.id, pc.product);
    }

    return Array.from(uniqueProducts.values());
  }

  async getFilteredProducts(
    categoryId: number | undefined,
    filters: ProductFilters,
  ) {
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

    const whereConditions: Record<string, any> = {
      ...(existence === 'true' || existence === true
        ? { existence: true }
        : {}),
      ...(sales === 'true' || sales === true ? { sales: true } : {}),
      ...(brands
        ? {
            brand: {
              title: {
                in: Array.isArray(brands) ? brands : [brands],
              },
            },
          }
        : {}),
      ...(sizes
        ? {
            productSize: {
              in: Array.isArray(sizes) ? sizes : [sizes],
            },
          }
        : {}),
      ...(ages
        ? {
            productAge: {
              in: Array.isArray(ages) ? ages : [ages],
            },
          }
        : {}),
      ...(weights
        ? {
            productWeight: {
              in: (Array.isArray(weights) ? weights : [weights]).map(Number),
            },
          }
        : {}),
      ...(foodClasses
        ? {
            productFeedClass: {
              in: Array.isArray(foodClasses) ? foodClasses : [foodClasses],
            },
          }
        : {}),
      ...(manufacturers
        ? {
            productManufacturer: {
              in: Array.isArray(manufacturers)
                ? manufacturers
                : [manufacturers],
            },
          }
        : {}),
      ...(minPrice || maxPrice
        ? {
            productPrice: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {}),
            },
          }
        : {}),
    };

    const subcategories = await this.prismaService.category.findMany({
      where: {
        parentId: categoryId,
      },
      select: { id: true },
    });

    const categoryIds = [categoryId, ...subcategories.map((c) => c.id)];
    const filteredCategoryIds = categoryIds?.filter(
      (id): id is number => typeof id === 'number',
    );

    return this.prismaService.products.findMany({
      where: {
        ...whereConditions,
        ...(filteredCategoryIds && filteredCategoryIds.length
          ? {
              productCategory: {
                some: {
                  categoryId: {
                    in: filteredCategoryIds,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        brand: true,
        productCategory: {
          include: {
            category: true,
          },
        },
      },
    });
  }
}

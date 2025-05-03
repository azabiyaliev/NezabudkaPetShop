import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OneCImportDto } from '../dto/onec-import.dto';

@Injectable()
export class IntegrationService {
  constructor(private readonly prisma: PrismaService) {}

  async handleImport(data: OneCImportDto) {
    const { products = [], categories = [], brands = [] } = data;

    const createdBrands = new Map<string, number>();
    const createdCategories = new Map<string, number>();

    let createdProductsCount = 0;
    let updatedProductsCount = 0;
    let skippedProductsCount = 0;
    const skippedProductsNames: string[] = [];
    const updatedProductsNames: Array<{
      productName: string;
      updatedFields: Record<string, { old: any; new: any }>;
    }> = [];

    await this.prisma.$transaction(async (tx) => {
      // Создаем бренды
      for (const brand of brands) {
        const found = await tx.brand.findUnique({
          where: { title: brand.title },
        });

        if (!found) {
          const created = await tx.brand.create({
            data: {
              title: brand.title,
              logo: brand.logo || null,
              description: brand.description || null,
            },
          });
          createdBrands.set(brand.title, created.id);
        } else {
          createdBrands.set(brand.title, found.id);
        }
      }

      // Создаем категории
      for (const category of categories) {
        const found = await tx.category.findFirst({
          where: { title: category.title },
        });

        if (!found) {
          const created = await tx.category.create({
            data: { title: category.title },
          });
          createdCategories.set(category.title, created.id);
        } else {
          createdCategories.set(category.title, found.id);
        }
      }

      // Создаем продукты
      for (const product of products) {
        const brandId = product.brandTitle
          ? createdBrands.get(product.brandTitle)
          : undefined;
        const categoryId = product.categoryTitle
          ? createdCategories.get(product.categoryTitle)
          : undefined;

        const existingProduct = await tx.products.findFirst({
          where: {
            productName: product.productName,
            ...(brandId ? { brandId: brandId } : {}),
          },
        });

        if (existingProduct) {
          const updates: Record<string, { old: any; new: any }> = {};

          if (existingProduct.productPrice !== product.productPrice) {
            updates.productPrice = {
              old: existingProduct.productPrice,
              new: product.productPrice,
            };
          }
          if (
            existingProduct.productDescription !==
            (product.productDescription || '')
          ) {
            updates.productDescription = {
              old: existingProduct.productDescription,
              new: product.productDescription || '',
            };
          }
          if (existingProduct.productPhoto !== product.productPhoto) {
            updates.productPhoto = {
              old: existingProduct.productPhoto,
              new: product.productPhoto,
            };
          }
          if (existingProduct.sales !== (product.sales ?? false)) {
            updates.sales = {
              old: existingProduct.sales,
              new: product.sales ?? false,
            };
          }
          if (existingProduct.existence !== (product.existence ?? true)) {
            updates.existence = {
              old: existingProduct.existence,
              new: product.existence ?? true,
            };
          }

          const normalizeNumber = (
            value: number | null | undefined,
          ): number => {
            return value ?? 0; // если null или undefined — считаем 0
          };

          if (
            normalizeNumber(existingProduct.promoPercentage) !==
            normalizeNumber(product.promoPercentage)
          ) {
            updates.promoPercentage = {
              old: existingProduct.promoPercentage,
              new: product.promoPercentage,
            };
          }

          const oldPromoPrice = normalizeNumber(existingProduct.promoPrice);
          const newPromoPrice = normalizeNumber(product.promoPrice);
          if (oldPromoPrice !== newPromoPrice) {
            updates.promoPrice = {
              old: existingProduct.promoPrice,
              new: product.promoPrice,
            };
          }

          if (Object.keys(updates).length > 0) {
            // 1. Обновляем товар
            await tx.products.update({
              where: { id: existingProduct.id },
              data: {
                productPrice: product.productPrice,
                productDescription: product.productDescription || '',
                productPhoto: product.productPhoto,
                sales: product.sales ?? false,
                existence: product.existence ?? true,
                promoPercentage: product.promoPercentage,
                promoPrice: product.promoPrice,
                startDateSales: product.startDateSales
                  ? new Date(product.startDateSales)
                  : undefined,
                endDateSales: product.endDateSales
                  ? new Date(product.endDateSales)
                  : undefined,
                productComment: product.productComment || '',
                productWeight: product.productWeight,
                productSize: product.productSize,
                productAge: product.productAge,
                productFeedClass: product.productFeedClass,
                productManufacturer: product.productManufacturer,
                productCategory: categoryId
                  ? {
                      deleteMany: {},
                      create: [
                        {
                          category: { connect: { id: categoryId } },
                        },
                      ],
                    }
                  : undefined,
              },
            });

            // 2. Логируем изменения в историю
            for (const [field, change] of Object.entries(updates)) {
              await tx.productUpdateHistory.create({
                data: {
                  productId: existingProduct.id,
                  fieldName: field,
                  oldValue: String(change.old ?? ''),
                  newValue: String(change.new ?? ''),
                },
              });
            }

            updatedProductsCount++;
            updatedProductsNames.push({
              productName: product.productName,
              updatedFields: updates,
            });
          } else {
            skippedProductsCount++;
            skippedProductsNames.push(product.productName);
          }

          continue; // после обработки существующего продукта — переходим к следующему
        }

        // Создаем новый продукт, если не найден
        await tx.products.create({
          data: {
            productName: product.productName,
            productPhoto: product.productPhoto,
            productPrice: product.productPrice,
            productDescription: product.productDescription || '',
            existence: product.existence ?? true,
            sales: product.sales ?? false,
            startDateSales: product.startDateSales
              ? new Date(product.startDateSales)
              : undefined,
            endDateSales: product.endDateSales
              ? new Date(product.endDateSales)
              : undefined,
            promoPercentage: product.promoPercentage,
            promoPrice: product.promoPrice,
            productComment: product.productComment || '',
            productWeight: product.productWeight,
            productSize: product.productSize,
            productAge: product.productAge,
            productFeedClass: product.productFeedClass,
            productManufacturer: product.productManufacturer,
            brandId,
            productCategory: categoryId
              ? {
                  create: [
                    {
                      category: { connect: { id: categoryId } },
                    },
                  ],
                }
              : undefined,
          },
        });

        createdProductsCount++;
      }
    });

    // Логируем успешный запрос
    await this.prisma.integrationLog.create({
      data: {
        requestBody: JSON.parse(JSON.stringify(data)) as object,
        status: 'success',
      },
    });

    return {
      success: true,
      createdProductsCount,
      updatedProductsCount,
      skippedProductsCount,
      skippedProductsNames,
      updatedProductsNames,
    };
  }
}

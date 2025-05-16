import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import {
  OneCBrandDto,
  OneCCategoryDto,
  OneCImportDto,
} from '../dto/onec-import.dto';
import { RawProduct } from '../types';

interface OneCImportRaw {
  products?: RawProduct[];
  brands?: OneCBrandDto[];
  categories?: OneCCategoryDto[];
  [key: string]: any;
}

@Injectable()
export class OneCImportTransformPipe implements PipeTransform {
  transform(value: OneCImportRaw, _metadata: ArgumentMetadata): OneCImportDto {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Тело запроса должно быть объектом');
    }

    if (!Array.isArray(value.products)) {
      throw new BadRequestException(
        'Поле "products" обязательно и должно быть массивом',
      );
    }

    if (!Array.isArray(value.brands)) {
      value.brands = [];
    }

    if (!Array.isArray(value.categories)) {
      value.categories = [];
    }

    // Преобразуем продукты
    value.products = value.products.map((product: RawProduct) => ({
      productName: product.productName,
      productPhoto: product.productPhoto,
      productPrice:
        product.productPrice !== undefined && product.productPrice !== null
          ? Number(product.productPrice)
          : 0,
      productDescription: product.productDescription || '',
      brandTitle: product.brandTitle || null,
      categoryTitle: product.categoryTitle || null,
      existence: product.existence ?? true,
      sales: product.sales ?? false,
      promoPercentage:
        product.promoPercentage !== undefined &&
        product.promoPercentage !== null
          ? Number(product.promoPercentage)
          : null,
      promoPrice:
        product.promoPrice !== undefined && product.promoPrice !== null
          ? Number(product.promoPrice)
          : null,
      productComment: product.productComment || '',
      productWeight: product.productWeight ?? null,
      productSize: product.productSize || null,
      productAge: product.productAge || null,
      productFeedClass: product.productFeedClass || null,
      productManufacturer: product.productManufacturer || null,
      startDateSales: product.startDateSales,
      endDateSales: product.endDateSales,
    }));

    return value as OneCImportDto;
  }
}

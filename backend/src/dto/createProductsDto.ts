import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductsDto {
  @IsNotEmpty()
  @IsString()
  productName!: string;
  productPhoto!: string;

  @IsNotEmpty()
  @IsNumberString()
  productPrice!: number;

  @IsNotEmpty()
  @IsString()
  productDescription!: string;

  @IsNotEmpty()
  @IsNumberString()
  categoryId!: number;

  @IsOptional()
  @IsNumberString()
  subcategoryId?: number;

  @IsNotEmpty()
  @IsNumberString()
  brandId?: number;

  @IsOptional()
  existence?: string;

  @IsOptional()
  sales?: string;

  @IsOptional()
  startDateSales?: string;

  @IsOptional()
  endDateSales?: string;

  @IsOptional()
  productManufacturer?: string;

  @IsOptional()
  productSize?: string;

  @IsOptional()
  productWeight?: number;

  @IsOptional()
  productAge?: string;

  @IsOptional()
  productFeedClass?: string;
}

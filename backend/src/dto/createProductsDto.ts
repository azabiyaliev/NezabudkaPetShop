import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

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

  @IsOptional()
  @IsNumberString()
  brandId?: number;

  @IsOptional()
  existence?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  sales?: boolean;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  startDateSales?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  endDateSales?: Date;

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

  @IsOptional()
  promoPercentage?: number;

  @IsOptional()
  promoPrice?: number;
}

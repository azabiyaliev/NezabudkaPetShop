import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProductsDto } from './createProductsDto';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsOptional()
  @IsInt()
  productId!: number;

  @ValidateNested({ each: true })
  @Type(() => CreateProductsDto)
  products!: CreateProductsDto;

  @IsInt()
  orderAmount!: number;

  @IsNotEmpty()
  @IsInt()
  quantity!: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  productPhoto?: string;

  @IsOptional()
  @IsInt()
  productPrice?: number;

  @IsOptional()
  @IsInt()
  promoPercentage?: number;

  @IsOptional()
  @IsInt()
  promoPrice?: number;

  @IsOptional()
  @IsBoolean()
  sales?: boolean;

  @IsOptional()
  @IsString()
  productDescription?: string;
}

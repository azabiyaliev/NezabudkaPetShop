import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateProductsDto } from './createProductsDto';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty()
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
}

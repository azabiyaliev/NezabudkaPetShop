import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductsDto {
  @IsNotEmpty()
  @IsString()
  productName!: string;

  @IsNotEmpty()
  @IsString()
  productPhoto!: string;

  @IsNotEmpty()
  @IsInt()
  productPrice!: number;

  @IsNotEmpty()
  @IsString()
  productDescription!: string;

  @IsNotEmpty()
  @IsInt()
  categoryId!: number;
  @IsNotEmpty()
  @IsInt()
  brandId!: number;

  @IsBoolean()
  existence!: boolean;
  @IsBoolean()
  sales!: boolean;
}

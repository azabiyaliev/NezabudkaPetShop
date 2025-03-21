import {
  IsBoolean,
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

  @IsNotEmpty()
  @IsNumberString()
  brandId!: number;

  @IsOptional()
  @IsBoolean()
  existence?: boolean | string;

  @IsOptional()
  @IsBoolean()
  sales?: boolean | string;
}

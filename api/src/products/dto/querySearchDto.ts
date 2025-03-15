import { IsNumberString, IsOptional } from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  @IsNumberString()
  categoryId?: number;

  @IsOptional()
  @IsNumberString()
  brandId?: number;
}

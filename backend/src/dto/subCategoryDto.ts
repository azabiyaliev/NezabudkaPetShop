import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class SubcategoryDto {
  @IsNotEmpty({ message: 'Название обязяательно' })
  title!: string;
  @IsOptional()
  @IsNumber({}, { message: 'parentId должен быть числом' })
  parentId?: number | null;
  @IsOptional()
  @IsNumber({}, { message: 'id должен быть числом' })
  id?: number;
  @IsOptional()
  subcategories?: SubcategoryDto[];
  @IsOptional()
  image?: string | null;
}

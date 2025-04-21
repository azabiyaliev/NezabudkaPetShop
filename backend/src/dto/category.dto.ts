import { IsNotEmpty, IsOptional } from 'class-validator';
import { SubcategoryDto } from './subCategoryDto';

export class CategoryDto {
  @IsNotEmpty({ message: 'Укажите название категории или подкатегории' })
  title!: string;
  @IsOptional()
  parentId?: null | number;
  @IsOptional()
  subcategories?: SubcategoryDto[];
  @IsOptional()
  icon?: string | null;
  @IsOptional()
  image?: string | null;
}

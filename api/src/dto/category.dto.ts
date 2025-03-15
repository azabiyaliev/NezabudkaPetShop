import { IsNotEmpty, IsOptional } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty({ message: 'Укажите название категории или подкатегории' })
  title!: string;
  @IsOptional()
  parentId?: null | number;
}

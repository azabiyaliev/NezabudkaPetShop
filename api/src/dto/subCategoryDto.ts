import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class SubcategoryDto {
  @IsNotEmpty({ message: 'Название обязяательно' })
  title!: string;

  @IsOptional()
  @IsNumber({}, { message: 'parentId должен быть числом' })
  parentId?: number | null;
}

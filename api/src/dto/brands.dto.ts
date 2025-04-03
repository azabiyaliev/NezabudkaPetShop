import { IsNotEmpty, IsOptional } from 'class-validator';

export class BrandDto {
  @IsNotEmpty({ message: 'title Название бренда не может быть пустым!' })
  title!: string;
  @IsOptional()
  logo?: string | null;
  @IsOptional()
  description?: null | string;
  @IsOptional()
  editLogo?: boolean;
}

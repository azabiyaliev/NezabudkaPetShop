import { IsNotEmpty, IsOptional } from 'class-validator';

export class CartDto {
  @IsNotEmpty({ message: 'Идентификатор продукта не может быть пустым!' })
  productId!: number;
  @IsNotEmpty({ message: 'Указать количество продукта!' })
  quantity!: number;
  @IsOptional()
  userId?: number;
  @IsOptional()
  guestId?: number;
  @IsOptional()
  token?: string;
}

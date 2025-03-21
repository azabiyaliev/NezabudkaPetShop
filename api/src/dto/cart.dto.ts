import { IsNotEmpty } from 'class-validator';

export class CartDto {
  @IsNotEmpty({ message: 'Идентификатор продукта не может быть пустым!' })
  productId!: number;
  @IsNotEmpty({ message: 'Указать количество продукта!' })
  quantity!: number;
}

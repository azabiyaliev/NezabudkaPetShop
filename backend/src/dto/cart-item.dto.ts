import { IsNotEmpty } from 'class-validator';

export class CartItemDto {
  @IsNotEmpty({
    message: 'productId Идентификатор товара не может быть пустым!',
  })
  productId!: number;
  @IsNotEmpty({ message: 'quantity Количество товара не может быть пустым!' })
  quantity!: number;
}

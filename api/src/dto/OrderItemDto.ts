import { IsInt, IsNotEmpty } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsInt()
  productId!: number;

  @IsInt()
  orderAmount!: number;

  @IsNotEmpty()
  @IsInt()
  quantity!: number;
}

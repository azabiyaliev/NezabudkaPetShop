import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class CheckoutOrderDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsNotEmpty()
  @IsInt()
  productId!: number;

  @IsNotEmpty()
  @IsInt()
  quantity!: number;

  @IsBoolean()
  isDelivered?: boolean;
}

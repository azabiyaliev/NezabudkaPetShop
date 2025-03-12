import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class CheckoutOrderDto {
  id!: string;
  @IsNotEmpty()
  @IsInt()
  productId!: string;

  @IsNotEmpty()
  @IsInt()
  quantity!: number;

  @IsBoolean()
  isDelivered?: boolean;
}

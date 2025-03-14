import { IsBoolean, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  productId!: number;

  @IsNotEmpty()
  @IsInt()
  orderId!: number;

  @IsNotEmpty()
  @IsInt()
  quantity!: number;

  @IsBoolean()
  isDelivered?: boolean;

  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsNotEmpty()
  @IsInt()
  quantity!: number;

  @IsBoolean()
  isDelivered?: boolean;

  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

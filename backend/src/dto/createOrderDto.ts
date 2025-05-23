import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { DeliveryMethod, OrderStatus, PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';
import { OrderItemDto } from './OrderItemDto';

export class CreateOrderDto {
  id?: number;

  @IsOptional()
  @ValidateIf((o: CreateOrderDto) => o.deliveryMethod === 'Delivery')
  @IsString({ message: 'Это поле должнно быть строковым ' })
  @Matches(/^[a-zA-Zа-яА-Я0-9\s,.-]+$/, { message: 'Неверный формат адреса' })
  address?: string;

  @IsOptional()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Введите валидеый email адрес',
  })
  @IsEmail()
  @IsString()
  guestEmail?: string | null;

  @IsOptional()
  @IsString()
  guestName?: string | null;

  @IsOptional()
  @IsString()
  guestLastName?: string | null;

  @IsOptional()
  @Matches(/^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/)
  @IsPhoneNumber()
  @IsString()
  guestPhone?: string | null;

  @IsOptional()
  @IsString()
  orderComment?: string;

  @IsOptional()
  userId?: number | string;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsEnum(DeliveryMethod)
  deliveryMethod!: DeliveryMethod;

  @IsOptional()
  @IsInt()
  @Min(0)
  bonusUsed?: number;

  @IsOptional()
  @IsBoolean()
  useBonus?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchive?: boolean;

  @IsString()
  recaptchaToken!: string;

  @IsNotEmpty()
  @IsNumber()
  totalPrice!: number;
}

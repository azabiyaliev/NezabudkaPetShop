import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';
import { OrderItemDto } from './OrderItemDto';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Адрес не может быть пустым' })
  @IsString({ message: 'Это поле должнно быть строковым ' })
  @Matches(/^[a-zA-Zа-яА-Я0-9\s,.-]+$/, { message: 'Неверный формат адреса' })
  address!: string;

  @IsOptional()
  @Matches(/^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/, {
    message: 'Введите валидеый email адрес',
  })
  @IsEmail()
  @IsString()
  guestEmail?: string;

  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsString()
  guestLastName?: string;

  @IsOptional()
  @Matches(/^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/)
  @IsPhoneNumber()
  @IsString()
  guestPhone?: string;

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
}

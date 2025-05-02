import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeliveryPagedDto {
  @IsOptional()
  id!: number;
  @IsNotEmpty({
    message: 'text Поле для описание страницы обязательно к заполнению',
  })
  text!: string;
  @IsNotEmpty({
    message: 'price Поле для описание цен на доставку обязательно к заполнению',
  })
  price!: string;
  @IsNotEmpty({
    message: 'map Поле для ccылки на картк обязательно к заполнению',
  })
  map!: string;
  @IsString()
  @IsNotEmpty()
  checkoutDeliveryPriceInfo!: string;
}

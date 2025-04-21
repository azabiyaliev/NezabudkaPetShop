import { IsNotEmpty, IsOptional } from 'class-validator';

export class EditionSitedDto {
  @IsOptional()
  id!: number;
  @IsNotEmpty({
    message: 'instagram Поле для instagram обязательно к заполнению',
  })
  instagram!: string;

  @IsNotEmpty({
    message: 'whatsapp Поле для whatsapp обязательно к заполнению',
  })
  whatsapp!: string;

  @IsNotEmpty({
    message: 'schedule Поле для графика обязательно к заполнению',
  })
  schedule!: string;

  @IsNotEmpty({ message: 'address Поле для адреса обязательно к заполнению' })
  address!: string;

  @IsNotEmpty({ message: 'email Поле для email обязательно к заполнению' })
  email!: string;

  @IsNotEmpty({ message: 'phone Поле для телефона обязательно к заполнению' })
  phone!: string;

  @IsNotEmpty({
    message: 'linkAddress Поле для ссылки для адреса обязательно к заполнению',
  })
  linkAddress!: string;
  @IsNotEmpty({
    message: 'mapGoogleLink Поле для ссылки Google карты обязательно к заполнению',
  })
  mapGoogleLink!: string;
}

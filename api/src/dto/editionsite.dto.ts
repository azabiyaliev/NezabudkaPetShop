import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PhotoByCarouselDto } from './photoCarousel.dto';

export class EditionSitedDto {
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

  @IsOptional()
  @IsArray({ message: 'Фото для карусели должно быть массивом' })
  @ValidateNested({
    each: true,
    message: 'Каждый элемент фото для карусели должен быть объектом',
  })
  @Type(() => PhotoByCarouselDto)
  PhotoByCarousel?: PhotoByCarouselDto[];
}

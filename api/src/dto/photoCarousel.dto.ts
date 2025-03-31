import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PhotoByCarouselDto {
  @IsNotEmpty({
    message: 'Id обязателен',
  })
  id?: number;

  @IsNotEmpty({
    message: 'photo Поле для фотографии обязательно к заполнению',
  })
  photo!: string;

  @IsNotEmpty({
    message: 'link Поле для ссылки обязательно к заполнению',
  })
  link!: string;

  @IsOptional()
  @IsNumber({}, { message: 'order Порядок должен быть числом' })
  order?: number;
}

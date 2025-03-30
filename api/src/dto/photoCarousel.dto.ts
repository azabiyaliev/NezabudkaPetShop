import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PhotoByCarouselDto {
  @IsNotEmpty({
    message: 'Id обязателен',
  })
  id?: number;

  @IsNotEmpty({
    message: 'Поле для фотографии обязательно к заполнению',
  })
  @IsString({ message: 'Фото должно быть строкой (URL)' })
  photo!: string;

  @IsNotEmpty({
    message: 'Поле для ссылки обязательно к заполнению',
  })
  @IsString({ message: 'Ссылка должна быть строкой (URL)' })
  link!: string;

  @IsOptional()
  @IsNumber({}, { message: 'Порядок должен быть числом' })
  order?: number;
}

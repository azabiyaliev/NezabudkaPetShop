import { IsNotEmpty } from 'class-validator';

export class PhotoByCarouselDto {
  @IsNotEmpty({
    message: 'Поле для фотографии обязательно к заполнению',
  })
  photo!: string;
}

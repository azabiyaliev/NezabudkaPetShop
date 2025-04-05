import { IsString } from 'class-validator';

export class PhotoByCarouselDto {
  id!: number;
  photo!: string;
  @IsString()
  link!: string;
  order!: number;
}

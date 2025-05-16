import { IsNotEmpty, IsOptional } from 'class-validator';

export class BonusProgramPGdDto {
  @IsOptional()
  id!: number;
  @IsNotEmpty({
    message: 'text Поле для описание страницы обязательно к заполнению',
  })
  text!: string;
}

import { IsNotEmpty, IsOptional } from 'class-validator';

export class AdminInfoDto {
  @IsOptional()
  id!: number;
  @IsNotEmpty({
    message: 'information Поле для описание страницы обязательно к заполнению',
  })
  information!: string;
}

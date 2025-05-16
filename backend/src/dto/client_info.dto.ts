import { IsNotEmpty, IsOptional } from 'class-validator';

export class ClientInfoDto {
  @IsOptional()
  id!: number;
  @IsNotEmpty({
    message: 'information Поле для описание страницы обязательно к заполнению',
  })
  information!: string;
}

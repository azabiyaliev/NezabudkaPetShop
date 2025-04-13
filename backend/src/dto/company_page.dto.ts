import { IsNotEmpty, IsOptional } from 'class-validator';

export class CompanyPagedDto {
  @IsOptional()
  id!: number;
  @IsNotEmpty({
    message: 'text Поле для описание страницы обязательно к заполнению',
  })
  text!: string;
}

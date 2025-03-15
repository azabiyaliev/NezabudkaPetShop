import { IsNotEmpty, IsOptional } from 'class-validator';

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
    message: 'schedule Поле для schedule обязательно к заполнению',
  })
  schedule!: string;
  @IsNotEmpty({ message: 'address Поле для address обязательно к заполнению' })
  address!: string;
  @IsNotEmpty({ message: 'email Поле для email обязательно к заполнению' })
  email!: string;
  @IsNotEmpty({ message: 'phone Поле для phone обязательно к заполнению' })
  phone!: string;
  @IsOptional()
  logo!: string;
}

import { IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsNotEmpty({ message: 'firstName Поле для Имени обязательно к заполнению' })
  firstName!: string;
  @IsNotEmpty({
    message: 'secondName Поле для Фамилии обязательно к заполнению',
  })
  secondName!: string;
  @IsNotEmpty({ message: 'email Поле для Почты обязательно к заполнению' })
  email!: string;
  @IsNotEmpty({ message: 'password Поле для Пароля обязательно к заполнению' })
  password!: string;
  @IsOptional()
  @Matches(/^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/, {
    message:
      'phone Номер телефона должен быть в формате +996 XXX XXX XXX или 0XXX XXX XXX',
  })
  phone?: string;
  @IsOptional()
  @IsEnum(Role, { message: 'Роль должна быть: client | admin' })
  role?: Role;
}

export class LoginDto {
  @IsNotEmpty({ message: 'email Поле для Почты обязательно к заполнению' })
  email!: string;
  @IsNotEmpty({ message: 'password Поле для Пароля обязательно к заполнению' })
  password!: string;
}

import { IsNotEmpty, IsOptional } from 'class-validator';

enum Role {
  client = 'client',
  admin = 'admin',
}

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
  phone?: string;
  role!: Role;
}

export class LoginDto {
  @IsNotEmpty({ message: 'email Поле для Почты обязательно к заполнению' })
  email!: string;
  @IsNotEmpty({ message: 'password Поле для Пароля обязательно к заполнению' })
  password!: string;
}

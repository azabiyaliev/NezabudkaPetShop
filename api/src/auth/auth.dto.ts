export class RegisterDto {
  email!: string;
  firstName!: string;
  secondName!: string;
  password!: string;
  phone?: string;
}

export class LoginDto {
  email!: string;
  password!: string;
}

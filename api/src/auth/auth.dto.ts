enum Role {
  client = 'client',
  admin = 'admin',
}

export class RegisterDto {
  email!: string;
  firstName!: string;
  secondName!: string;
  password!: string;
  phone?: string;
  role!: Role;
}

export class LoginDto {
  email!: string;
  password!: string;
}

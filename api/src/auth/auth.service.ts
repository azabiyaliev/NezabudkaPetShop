import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';

const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;
const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const { email, firstName, secondName, password } = registerDto;
    let phone = registerDto.phone;

    if (
      email.trim() === '' ||
      firstName.trim() === '' ||
      secondName.trim() === '' ||
      password.trim() === ''
    ) {
      throw new BadRequestException(
        'Missing required fields: email, firstName, secondName or password',
      );
    }

    if (password.includes(' ')) {
      throw new BadRequestException({
        error: 'The password must not contain spaces.',
      });
    }

    if (!regEmail.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (phone) {
      if (!regPhone.test(phone))
        throw new BadRequestException('Invalid number format');

      phone = phone.replace(/\s/g, '');
      if (!phone.startsWith('+996')) {
        phone = '+996' + phone.replace(/^0/, '');
      }
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with this email ${email} already exists`,
      );
    }

    const existingPhone = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      throw new ConflictException(
        `User with this phone ${phone} already exists`,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        secondName,
        password: hashedPassword,
        phone,
        token: crypto.randomUUID(),
      },
    });

    return { message: 'User created successfully', user: user };
  }

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!email || !password) {
      throw new UnauthorizedException(
        'Missing required fields: email or password',
      );
    }

    if (!regEmail.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = crypto.randomUUID();

    await this.prisma.user.update({
      where: { email },
      data: { token },
    });

    return { email: user.email, firstName: user.firstName, token };
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { token: crypto.randomUUID() },
    });
  }

  async findByToken(token: string) {
    return this.prisma.user.findFirst({ where: { token } });
  }
}

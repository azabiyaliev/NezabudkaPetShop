import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;
const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;

interface FacebookPayload {
  email: string;
  id: string;
  firstName: string;
  secondName: string;
}

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async generateUserToken(userId: number): Promise<string> {
    const token = crypto.randomUUID();

    await this.prisma.user.update({
      where: { id: userId },
      data: { token },
    });

    return token;
  }

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

  async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async verifyFacebookToken(accessToken: string) {
    try {
      // Отправляем запрос на Facebook API для верификации токена
      const url = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,first_name,last_name,email,`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new UnauthorizedException('Invalid Facebook user data');
      }

      const data = (await response.json()) as FacebookPayload;
      console.log(data);

      if (data && data.id) {
        return data;
      } else {
        throw new UnauthorizedException('Invalid Facebook token');
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Facebook authentication failed');
    }
  }

  async loginWithFacebook(accessToken: string) {
    const payload = await this.verifyFacebookToken(accessToken);

    const { email, id: facebookID, firstName, secondName } = payload;

    if (!firstName && !secondName) {
      throw new UnauthorizedException('Not enough data from Facebook');
    }

    let userEmail = email;
    if (!userEmail) {
      userEmail = `${facebookID}@facebook.com`;
    }

    let user = await this.prisma.user.findUnique({ where: { facebookID } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: userEmail,
          password: crypto.randomUUID(), // Генерируем случайный пароль
          facebookID,
          firstName: firstName,
          secondName: secondName,
        },
      });
    }

    // Генерация токена для пользователя
    const token = await this.generateUserToken(user.id);
    console.log(user);

    return { message: 'Login with Facebook success.', user, token };
  }
}

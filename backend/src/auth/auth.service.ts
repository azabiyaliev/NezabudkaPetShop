import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;
export const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;

interface FacebookPayload {
  email: string;
  id: string;
  first_name: string;
  last_name: string;
}

enum Role {
  client = 'client',
  admin = 'admin',
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
    const { email, firstName, secondName, password, role } = registerDto;
    let phone = registerDto.phone;

    if (password.includes(' ')) {
      throw new ConflictException('Пароль не должен содержать пустых отступов');
    }

    if (!regEmail.test(email)) {
      throw new BadRequestException('Неправильный формат для почты');
    } else if (phone) {
      if (!regPhone.test(phone)) phone = phone.replace(/\s/g, '');
      if (!phone.startsWith('+996')) {
        phone = '+996' + phone.replace(/^0/, '');
      }
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new ConflictException(
        `Пользователь с таким Email ${email} уже существует`,
      );
    } else if (existingPhone) {
      throw new ConflictException(
        `Пользователь с таким номером ${phone} уже существует`,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const defaultPhone = phone?.trim() === '' ? null : phone;

    const user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        secondName,
        password: hashedPassword,
        phone: defaultPhone,
        role: role ? (role as Role) : undefined,
        token: crypto.randomUUID(),
      },
    });

    return { message: 'Пользователь создан успешно', user: user };
  }

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!regEmail.test(email)) {
      throw new BadRequestException('Неправильный формат почты');
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        'Неверный email или пароль. Проверьте данные и попробуйте снова.',
      );
    }

    const token = crypto.randomUUID();

    await this.prisma.user.update({
      where: { email },
      data: { token },
    });

    return {
      email: user.email,
      firstName: user.firstName,
      token,
      secondName: user.secondName,
      id: user.id,
      role: user.role,
      phone: user.phone,
    };
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
      const url = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,first_name,last_name,email`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new UnauthorizedException('Invalid Facebook user data');
      }
      const data = (await response.json()) as FacebookPayload;

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

    const {
      email,
      id: facebookID,
      first_name: firstName,
      last_name: secondName,
    } = payload;

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
          password: crypto.randomUUID(),
          facebookID,
          firstName,
          secondName,
        },
      });
    }
    const token = await this.generateUserToken(user.id);
    return { message: 'Login with Facebook success.', user, token };
  }
}

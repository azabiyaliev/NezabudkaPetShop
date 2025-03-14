import {
  Controller,
  Post,
  Body,
  Req,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { User } from '@prisma/client';
import { FacebookUserDto } from '../dto/facebook-user.dto';
import { GoogleUserDto } from '../dto/google-user.dto';
import { PrismaService } from '../prisma/prisma.service';

interface AuthRequest extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);

    return {
      message: 'Вход выполнен успешно',
      user: {
        email: user.email,
        firstName: user.firstName,
        token: user.token,
        secondName: user.secondName,
        id: user.id,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  @UseGuards(TokenAuthGuard)
  @Delete('logout')
  async logout(@Req() req: Request) {
    const user = (req as AuthRequest).user;
    await this.authService.logout(user.id);
    return { message: 'Выход выполнен успешно' };
  }

  @Post('google')
  async googleLogin(@Body() body: GoogleUserDto) {
    if (!body.credential) {
      throw new BadRequestException('Missing Google credential');
    }

    const payload = await this.authService.verifyGoogleToken(body.credential);

    if (!payload) {
      throw new BadRequestException('Invalid credential. Google login error!');
    }

    const {
      email,
      sub: googleID,
      given_name: firstName,
      family_name: secondName,
    } = payload;

    if (!email || !firstName || !secondName) {
      throw new BadRequestException('Not enough data from Google');
    }

    let user = await this.prisma.user.findUnique({ where: { googleID } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          password: crypto.randomUUID(),
          googleID,
          firstName,
          secondName,
        },
      });
    }
    const token = await this.authService.generateUserToken(user.id);
    return { message: 'Login with Google success.', user, token };
  }

  @Post('facebook')
  async facebookLogin(@Body() body: FacebookUserDto) {
    if (!body.accessToken) {
      throw new BadRequestException('Missing Facebook access token');
    }
    return await this.authService.loginWithFacebook(body.accessToken);
  }
}

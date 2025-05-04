import {
  Controller,
  Post,
  Body,
  Req,
  Delete,
  UseGuards,
  BadRequestException,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { FacebookUserDto } from '../dto/facebook-user.dto';
import { GoogleUserDto } from '../dto/google-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../types';
import { RecaptchaGuard } from '../recaptcha/recaptcha.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(RecaptchaGuard)
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = await this.authService.register(registerDto);

    const token = await this.authService.generateUserToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    res.cookie('tokenPresent', 'true', {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Пользователь зарегистрирован и авторизован',
      user,
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(loginDto);

    res.cookie('token', user.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    res.cookie('tokenPresent', 'true', {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Вход выполнен успешно',
      user,
    };
  }

  @UseGuards(TokenAuthGuard)
  @Delete('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = (req as AuthRequest).user;
    await this.authService.logout(user.id);

    res.clearCookie('token');
    res.clearCookie('tokenPresent');
    return { message: 'Выход выполнен успешно' };
  }

  @UseGuards(TokenAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    const user = (req as AuthRequest).user;
    return {
      email: user.email,
      firstName: user.firstName,
      secondName: user.secondName,
      id: user.id,
      role: user.role,
      phone: user.phone,
    };
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

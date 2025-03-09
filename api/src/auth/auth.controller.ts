import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { LoginDto, RegisterDto } from './auth.dto';
import { User } from '@prisma/client';

interface AuthRequest extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(loginDto);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        message: 'Login successful',
        user: {
          email: user.email,
          firstName: user.firstName,
          token: user.token,
          secondName: user.secondName,
          id: user.id
        },
      };
    } catch (e) {
      console.error('Login failed:', e);
      throw new UnauthorizedException('Login failed');
    }
  }

  @UseGuards(TokenAuthGuard)
  @Delete('logout')
  async logout(@Req() req: Request) {
    const user = (req as AuthRequest).user;
    await this.authService.logout(user.id);
    return { message: 'Logged out successfully' };
  }
}

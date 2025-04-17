import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthRequest } from '../types';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: AuthRequest = context.switchToHttp().getRequest();

    const token = req.cookies?.token;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.authService.findByToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    req.user = user;
    return true;
  }
}

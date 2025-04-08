import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { User } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User;
}

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.authService.findByToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    (req as AuthRequest).user = user;
    return true;
  }
}

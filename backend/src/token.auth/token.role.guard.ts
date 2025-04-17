import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const req: AuthRequest = context.switchToHttp().getRequest();
    const token = req.cookies?.token;

    if (!token) {
      throw new ForbiddenException('No token provided');
    }

    const user = await this.prisma.user.findFirst({
      where: { token },
    });

    if (!user) {
      throw new ForbiddenException('Invalid token');
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('Forbidden: You do not have access');
    }

    req.user = user;
    return true;
  }
}

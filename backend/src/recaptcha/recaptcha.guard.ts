import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { RecaptchaService } from './recaptcha.service';
import { RecaptchaReq } from '../types';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private readonly recaptchaService: RecaptchaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RecaptchaReq = context.switchToHttp().getRequest();
    const token = request.body.recaptchaToken;

    const isHuman = await this.recaptchaService.verifyToken(token);
    if (!isHuman) throw new BadRequestException('reCAPTCHA validation failed');

    return true;
  }
}

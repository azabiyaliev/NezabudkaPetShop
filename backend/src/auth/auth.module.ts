import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from '../configs/google-oauth.config';
import facebookOauthConfig from '../configs/facebook-oauth.config';
import { PrismaModule } from '../prisma/prisma.module';
import { RecaptchaService } from '../recaptcha/recaptcha.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forFeature(googleOauthConfig),
    ConfigModule.forFeature(facebookOauthConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, RecaptchaService],
  exports: [AuthService],
})
export class AuthModule {}

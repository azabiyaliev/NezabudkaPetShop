import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { TelegramModule } from '../telegram/telegram.module';
import { RecaptchaService } from '../recaptcha/recaptcha.service';

@Module({
  imports: [PrismaModule, AuthModule, TelegramModule],
  controllers: [OrdersController],
  providers: [OrdersService, RecaptchaService],
  exports: [OrdersService],
})
export class OrdersModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { DeliveryPageService } from './delivery_page.service';
import { DeliveryPageController } from './delivery_page.conrtoller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [DeliveryPageService],
  controllers: [DeliveryPageController],
})
export class DeliveryPageModule {}

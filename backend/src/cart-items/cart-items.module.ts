import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CartItemsService],
  controllers: [CartItemsController],
})
export class CartItemsModule {}

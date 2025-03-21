import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductsModule } from '../products/products.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [ProductsModule],
  providers: [CartService, PrismaService],
  controllers: [CartController],
})
export class CartModule {}

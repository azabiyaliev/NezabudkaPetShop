import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [BrandsService],
  controllers: [BrandsController],
})
export class BrandsModule {}

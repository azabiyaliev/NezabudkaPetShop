import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [PrismaModule, AuthModule, CommonModule],
  providers: [BrandsService],
  controllers: [BrandsController],
})
export class BrandsModule {}

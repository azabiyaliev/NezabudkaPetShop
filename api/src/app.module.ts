import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './seed/seed.service';
import { PrismaService } from './prisma/prisma.service';
import { BrandsController } from './brands/brands.controller';
import { PrismaModule } from './prisma/prisma.module';
import { BrandsModule } from './brands/brands.module';
import { BrandsService } from './brands/brands.service';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, BrandsModule],
  controllers: [AppController, BrandsController],
  providers: [AppService, SeedService, PrismaService, BrandsService],
})
export class AppModule {}

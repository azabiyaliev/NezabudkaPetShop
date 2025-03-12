import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './seed/seed.service';
import { PrismaService } from './prisma/prisma.service';
import { CategoryModule } from './category/category.module';
import { CategoryService } from './category/category.service';

@Module({
  imports: [AuthModule, UsersModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService, SeedService, PrismaService, CategoryService],
})
export class AppModule {}

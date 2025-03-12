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
import {EditionSiteModule} from "./editionsite/editionsite.module";
import {EditionSiteController} from "./editionsite/editionsite.controller";
import {EditionSiteService} from "./editionsite/editionsite.service";

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, BrandsModule, EditionSiteModule],
  controllers: [AppController, BrandsController, EditionSiteController],
  providers: [AppService, SeedService, PrismaService, BrandsService, EditionSiteService],
})
export class AppModule {}

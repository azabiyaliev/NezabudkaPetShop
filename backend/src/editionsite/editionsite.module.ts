import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { EditionSiteService } from './editionsite.service';
import { EditionSiteController } from './editionsite.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [EditionSiteService],
  controllers: [EditionSiteController],
})
export class EditionSiteModule {}

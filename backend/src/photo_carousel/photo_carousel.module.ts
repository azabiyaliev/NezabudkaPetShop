import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { PhotoCarouselController } from './photo_carousel.controller';
import { PhotoCarouselService } from './photo_carousel.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [PrismaModule, AuthModule, CommonModule],
  controllers: [PhotoCarouselController],
  providers: [PhotoCarouselService, PrismaService],
  exports: [PhotoCarouselService],
})
export class PhotoCarouselModule {}

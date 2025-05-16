import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CompanyPageService } from './company_page.service';
import { CompanyPageController } from './company_page.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CompanyPageService],
  controllers: [CompanyPageController],
})
export class CompanyPageModule {}

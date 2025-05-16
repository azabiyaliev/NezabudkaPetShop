import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AdminInfoService } from './admin_info.service';
import { AdminInfoController } from './admin_info.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [AdminInfoService],
  controllers: [AdminInfoController],
})
export class AdminInfoModule {}

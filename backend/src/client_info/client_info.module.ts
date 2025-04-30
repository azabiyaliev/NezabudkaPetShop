import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ClientInfoService } from './client_info.service';
import { ClientInfoController } from './client_info.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ClientInfoService],
  controllers: [ClientInfoController],
})
export class ClientInfoModule {}

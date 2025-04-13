import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { BonusProgramService } from './bonus_program_pg.service';
import { BonusPageController } from './bonus_program_pg.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [BonusProgramService],
  controllers: [BonusPageController],
})
export class BonusPageModule {}

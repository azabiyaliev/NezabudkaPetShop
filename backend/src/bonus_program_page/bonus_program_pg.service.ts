import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BonusProgramPGdDto } from '../dto/bonus_program_pg.dto';

@Injectable()
export class BonusProgramService {
  constructor(private readonly prisma: PrismaService) {}

  async getBonusProgram() {
    return await this.prisma.bonusProgramPage.findFirst();
  }

  async createBonusProgram(bonusDto: BonusProgramPGdDto) {
    return await this.prisma.bonusProgramPage.create({
      data: {
        ...bonusDto,
      },
    });
  }
  async updateBonusProgram(id: number, bonusDto: BonusProgramPGdDto) {
    const bonusPage = await this.prisma.bonusProgramPage.findUnique({
      where: { id },
    });
    if (!bonusPage) {
      throw new NotFoundException(`Сайт с id = ${id} не найден!`);
    }

    return this.prisma.bonusProgramPage.update({
      where: { id },
      data: { ...bonusDto },
    });
  }
}

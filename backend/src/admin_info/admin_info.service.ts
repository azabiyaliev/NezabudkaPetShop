import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminInfoDto } from '../dto/admin_info.dto';

@Injectable()
export class AdminInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminInfo() {
    return await this.prisma.adminInfo.findFirst();
  }

  async createAdminInfo(adminInfoDto: AdminInfoDto) {
    return await this.prisma.adminInfo.create({
      data: {
        ...adminInfoDto,
      },
    });
  }
  async updateAdminInfo(id: number, adminInfoDto: AdminInfoDto) {
    const bonusPage = await this.prisma.adminInfo.findUnique({
      where: { id },
    });
    if (!bonusPage) {
      throw new NotFoundException(`Сайт с id = ${id} не найден!`);
    }

    return this.prisma.adminInfo.update({
      where: { id },
      data: { ...adminInfoDto },
    });
  }
}

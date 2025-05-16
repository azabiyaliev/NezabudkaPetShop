import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyPagedDto } from '../dto/company_page.dto';

@Injectable()
export class CompanyPageService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompanyPage() {
    return await this.prisma.companyPages.findFirst();
  }

  async createCompanyPages(companyDto: CompanyPagedDto) {
    return await this.prisma.companyPages.create({
      data: {
        ...companyDto,
      },
    });
  }
  async updateCompanyPage(id: number, companyDto: CompanyPagedDto) {
    const companyPage = await this.prisma.companyPages.findUnique({
      where: { id },
    });
    if (!companyPage) {
      throw new NotFoundException(`Сайт с id = ${id} не найден!`);
    }

    return this.prisma.companyPages.update({
      where: { id },
      data: { ...companyDto },
    });
  }
}

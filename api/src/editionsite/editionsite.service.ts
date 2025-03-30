import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EditionSitedDto } from '../dto/editionsite.dto';

@Injectable()
export class EditionSiteService {
  constructor(private readonly prisma: PrismaService) {}

  async getSite() {
    return this.prisma.siteEdition.findFirst();
  }

  async createInfoSite(editionDto: EditionSitedDto) {
    try {
      return await this.prisma.siteEdition.create({
        data: {
          ...editionDto,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `${editionDto.address} уже существует и вы не можете его повторно добавить!`,
        );
      }
      throw error;
    }
  }
  async updateSite(id: number, editionDto: EditionSitedDto) {
    const editSite = await this.prisma.siteEdition.findUnique({
      where: { id },
    });

    if (!editSite) {
      throw new NotFoundException(`Сайт с id = ${id} не найден!`);
    }

    return this.prisma.siteEdition.update({
      where: { id },
      data: { ...editionDto },
    });
  }
}

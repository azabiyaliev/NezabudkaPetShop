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
    const { instagram, whatsapp, schedule, address, email, phone, logo } =
      editionDto;
    try {
      return await this.prisma.siteEdition.create({
        data: {
          instagram,
          whatsapp,
          schedule,
          address,
          email,
          phone,
          logo,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `${address} уже существует и вы не можете его повторно добавить!`,
        );
      }
      throw error;
    }
  }

  async updateSite(
    id: string,
    editionDto: EditionSitedDto,
    file?: Express.Multer.File,
  ) {
    const { instagram, whatsapp, schedule, address, email, phone } = editionDto;
    const logo = file ? '/editsite/' + file.filename : '';
    const editId = parseInt(id);
    const editSite = await this.prisma.siteEdition.findFirst();
    if (!editSite) {
      throw new NotFoundException(`Бренд с id = ${id} не найдена!`);
    }
    return this.prisma.siteEdition.update({
      where: { id: editId },
      data: {
        instagram,
        whatsapp,
        schedule,
        address,
        email,
        phone,
        logo,
      },
    });
  }
}

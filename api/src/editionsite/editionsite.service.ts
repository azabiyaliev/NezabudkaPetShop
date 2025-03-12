import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EditionSitedDto } from './editionsite.dto';

@Injectable()
export class EditionSiteService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllInfoBySite() {
    const infoSite = await this.prisma.siteEdition.findMany();
    return infoSite || [];
  }

  async createInfoSite(editionDto: EditionSitedDto) {
    const { instagram, whatsapp, schedule, address, email, phone, logo } =
      editionDto;
    if (!instagram) {
      throw new NotFoundException(' instagram не может быть пустым!');
    } else if (!whatsapp) {
      throw new NotFoundException('whatsapp не может быть пустым!');
    } else if (!schedule) {
      throw new NotFoundException('График работы не может быть пустым!');
    } else if (!address) {
      throw new NotFoundException('Адресс не может быть пустым!');
    } else if (!email) {
      throw new NotFoundException('email не может быть пустым!');
    } else if (!phone) {
      throw new NotFoundException('Номер телефона не может быть пустым!');
    } else if (!logo) {
      throw new NotFoundException('Логотип карусели не может быть пустым!');
    }
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
    let logo = editionDto.logo;
    if (file) {
      logo = '/editsite' + file.filename;
    }
    if (
      instagram.trim().length === 0 ||
      logo.trim().length === 0 ||
      email.trim().length === 0 ||
      phone.trim().length === 0 ||
      whatsapp.trim().length === 0 ||
      schedule.trim().length === 0 ||
      address.trim().length === 0
    ) {
      throw new NotFoundException(`Поля могут быть пустыми!`);
    }
    const editId = parseInt(id);
    const editSite = await this.prisma.siteEdition.findFirst({
      where: { id: editId },
    });
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

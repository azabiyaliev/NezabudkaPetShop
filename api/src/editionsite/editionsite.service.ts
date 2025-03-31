import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EditionSitedDto } from '../dto/editionsite.dto';

const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;
const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;

@Injectable()
export class EditionSiteService {
  constructor(private readonly prisma: PrismaService) {}

  async getSite() {
    return this.prisma.siteEdition.findFirst();
  }

  async createInfoSite(editionDto: EditionSitedDto) {
    try {
      if (!regEmail.test(editionDto.email)) {
        throw new BadRequestException('Неправильный формат для почты');
      } else if (editionDto.phone) {
        if (!regPhone.test(editionDto.phone))
          editionDto.phone = editionDto.phone.replace(/\s/g, '');
        if (!editionDto.phone.startsWith('+996')) {
          editionDto.phone = '+996' + editionDto.phone.replace(/^0/, '');
        }
      }
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryPagedDto } from '../dto/delivery_page.dto';

@Injectable()
export class DeliveryPageService {
  constructor(private readonly prisma: PrismaService) {}

  async getDeliveryPage() {
    return await this.prisma.deliveryPage.findFirst();
  }

  async createDeliveryPages(deliveryDto: DeliveryPagedDto) {
    return await this.prisma.deliveryPage.create({
      data: {
        ...deliveryDto,
      },
    });
  }
  async updateDeliveryPage(id: number, deliveryDto: DeliveryPagedDto) {
    const deliveryPage = await this.prisma.deliveryPage.findUnique({
      where: { id },
    });
    if (!deliveryPage) {
      throw new NotFoundException(`Сайт с id = ${id} не найден!`);
    }

    return this.prisma.deliveryPage.update({
      where: { id },
      data: { ...deliveryDto },
    });
  }
}

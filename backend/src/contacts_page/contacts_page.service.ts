import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryPagedDto } from '../dto/delivery_page.dto';

@Injectable()
export class ContactsPageService {
    constructor(private readonly prisma: PrismaService) {}

    async getContactsPage() {
        return await this.prisma.contactsPage.findFirst();
    }

    async createContactsPages(deliveryDto: DeliveryPagedDto) {
        return await this.prisma.contactsPage.create({
            data: {
                ...deliveryDto,
            },
        });
    }
    async updateContactsPage(id: number, deliveryDto: DeliveryPagedDto) {
        const contactsPage = await this.prisma.contactsPage.findUnique({
            where: { id },
        });
        if (!contactsPage) {
            throw new NotFoundException(`Сайт с id = ${id} не найден!`);
        }

        return this.prisma.contactsPage.update({
            where: { id },
            data: { ...deliveryDto },
        });
    }
}

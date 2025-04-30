import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminInfoDto } from '../dto/admin_info.dto';
import {ClientInfoDto} from "../dto/client_info.dto";

@Injectable()
export class ClientInfoService {
    constructor(private readonly prisma: PrismaService) {}

    async getClientInfo() {
        return await this.prisma.clientInfo.findFirst();
    }

    async createClientInfo(clientInfoDto: ClientInfoDto) {
        return await this.prisma.clientInfo.create({
            data: {
                ...clientInfoDto,
            },
        });
    }
    async updateClientInfo(id: number, clientInfoDto: ClientInfoDto) {
        const clientInfo = await this.prisma.clientInfo.findUnique({
            where: { id },
        });
        if (!clientInfo) {
            throw new NotFoundException(`Инофрмация для клиента с id = ${id} не найден!`);
        }

        return this.prisma.clientInfo.update({
            where: { id },
            data: { ...clientInfoDto },
        });
    }
}

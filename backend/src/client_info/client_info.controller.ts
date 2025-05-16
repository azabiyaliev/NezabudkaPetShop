import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';
import { ClientInfoService } from './client_info.service';
import { ClientInfoDto } from '../dto/client_info.dto';

@Controller('client_info')
export class ClientInfoController {
  constructor(private clientInfo: ClientInfoService) {}

  @Get()
  async getClientInfo() {
    return await this.clientInfo.getClientInfo();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Post()
  async createClientInfo(@Body() clientInfoDto: ClientInfoDto) {
    return this.clientInfo.createClientInfo(clientInfoDto);
  }
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Put(':id')
  async updateClientInfo(
    @Param('id') id: string,
    @Body() clientInfoDto: ClientInfoDto,
  ) {
    return this.clientInfo.updateClientInfo(parseInt(id), clientInfoDto);
  }
}

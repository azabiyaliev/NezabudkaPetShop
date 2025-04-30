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
import { AdminInfoService } from './admin_info.service';
import { AdminInfoDto } from '../dto/admin_info.dto';

@Controller('admin_info')
export class AdminInfoController {
  constructor(private adminInfo: AdminInfoService) {}

  @Get()
  async getAdminInfo() {
    return await this.adminInfo.getAdminInfo();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Post()
  async createAdminInfo(@Body() adminInfoDto: AdminInfoDto) {
    return this.adminInfo.createAdminInfo(adminInfoDto);
  }
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Put(':id')
  async updateAdminInfo(
    @Param('id') id: string,
    @Body() adminInfoDto: AdminInfoDto,
  ) {
    return this.adminInfo.updateAdminInfo(parseInt(id), adminInfoDto);
  }
}

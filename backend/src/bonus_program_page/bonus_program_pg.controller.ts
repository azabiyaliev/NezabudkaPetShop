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
import { CompanyPagedDto } from '../dto/company_page.dto';
import { BonusProgramService } from './bonus_program_pg.service';

@Controller('bonus_program')
export class BonusPageController {
  constructor(private bonusPage: BonusProgramService) {}

  @Get()
  async getBonusProgram() {
    return await this.bonusPage.getBonusProgram();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Post()
  async createSite(@Body() companyDto: CompanyPagedDto) {
    return this.bonusPage.createBonusProgram(companyDto);
  }
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Put(':id')
  async updateSite(
    @Param('id') id: string,
    @Body() companyDto: CompanyPagedDto,
  ) {
    return this.bonusPage.updateBonusProgram(parseInt(id), companyDto);
  }
}

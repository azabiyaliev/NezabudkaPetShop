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
import { CompanyPageService } from './company_page.service';
import { CompanyPagedDto } from '../dto/company_page.dto';

@Controller('my_company')
export class CompanyPageController {
  constructor(private companyPage: CompanyPageService) {}

  @Get()
  async getSiteData() {
    return await this.companyPage.getCompanyPage();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Post()
  async createSite(@Body() companyDto: CompanyPagedDto) {
    return this.companyPage.createCompanyPages(companyDto);
  }
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Put(':id')
  async updateSite(
    @Param('id') id: string,
    @Body() companyDto: CompanyPagedDto,
  ) {
    return this.companyPage.updateCompanyPage(parseInt(id), companyDto);
  }
}

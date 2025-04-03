import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EditionSiteService } from './editionsite.service';
import { EditionSitedDto } from '../dto/editionsite.dto';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('edition_site')
export class EditionSiteController {
  constructor(private editionSite: EditionSiteService) {}

  @Get()
  async getSiteData() {
    return await this.editionSite.getSite();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Post()
  async createSite(@Body() editionDto: EditionSitedDto) {
    return this.editionSite.createInfoSite(editionDto);
  }
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Put(':id')
  async updateSite(
    @Param('id') id: string,
    @Body() editionDto: EditionSitedDto,
  ) {
    return this.editionSite.updateSite(parseInt(id), editionDto);
  }
}

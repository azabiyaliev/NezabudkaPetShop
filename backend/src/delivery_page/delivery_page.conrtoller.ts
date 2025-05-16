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
import { DeliveryPageService } from './delivery_page.service';
import { DeliveryPagedDto } from '../dto/delivery_page.dto';

@Controller('delivery')
export class DeliveryPageController {
  constructor(private deliveryPage: DeliveryPageService) {}

  @Get()
  async getDeliveryData() {
    return await this.deliveryPage.getDeliveryPage();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Post()
  async createDelivery(@Body() deliveryDto: DeliveryPagedDto) {
    return this.deliveryPage.createDeliveryPages(deliveryDto);
  }
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Put(':id')
  async updateDelivery(
    @Param('id') id: string,
    @Body() deliveryDto: DeliveryPagedDto,
  ) {
    return this.deliveryPage.updateDeliveryPage(parseInt(id), deliveryDto);
  }
}

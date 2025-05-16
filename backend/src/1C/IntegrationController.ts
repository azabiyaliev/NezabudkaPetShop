import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { OneCImportTransformPipe } from './oneCImportTransform';
import { IntegrationService } from './IntegrationService';
import { OneCImportDto } from '../dto/onec-import.dto';

@Controller('api/integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('1c-import')
  @UsePipes(new OneCImportTransformPipe()) // Преобразуем данные 1С в нормальный формат
  async importFrom1C(@Body() data: OneCImportDto) {
    const result = await this.integrationService.handleImport(data);

    return {
      message: 'Данные успешно импортированы',
      result,
    };
  }
}

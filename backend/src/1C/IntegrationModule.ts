import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { IntegrationController } from './IntegrationController';
import { IntegrationService } from './IntegrationService';
import { IntegrationAuthMiddleware } from './integrationAuthMiddleware';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IntegrationAuthMiddleware)
      .forRoutes('api/integration/1c-import');
  }
}

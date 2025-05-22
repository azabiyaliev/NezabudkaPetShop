import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'node:process';
import { ValidationExceptionFilter } from './auth/auth.validate';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.use(cookieParser());

  const result = dotenv.config();

  if (result.error) {
    throw result.error;
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('EMAIL_USER или EMAIL_PASSWORD не установлены в .env');
    process.exit(1);
  }
  if (process.env.NODE_ENV === 'production') {
    app.setGlobalPrefix('api');
    app.useStaticAssets(join(__dirname, '..', 'public'), {
      prefix: '/api',
    });
  } else {
    app.useStaticAssets(join(__dirname, '..', 'public'));
  }
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();

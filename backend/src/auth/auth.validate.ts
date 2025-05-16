import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse = exception.getResponse() as {
      message: { [key: string]: string } | string[];
    };

    let formattedErrors: { [key: string]: string } = {};

    if (Array.isArray(exceptionResponse.message)) {
      exceptionResponse.message.forEach((msg) => {
        const match = msg.match(/^([^ ]+) (.+)$/);
        if (match) {
          formattedErrors[match[1]] = match[2];
        }
      });
    } else {
      formattedErrors = exceptionResponse.message;
    }

    response.status(400).json({
      statusCode: 400,
      errors: formattedErrors,
      error: 'Bad Request',
    });
  }
}

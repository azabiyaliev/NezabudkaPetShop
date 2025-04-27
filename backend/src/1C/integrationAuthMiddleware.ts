import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IntegrationAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        message: 'API ключ отсутствует',
      });
    }

    if (apiKey !== process.env.ONEC_API_KEY) {
      return res.status(403).json({
        message: 'Неверный API ключ',
      });
    }

    next();
  }
}

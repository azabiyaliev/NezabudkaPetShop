import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Интерфейс для настройки resize
export interface ResizeOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  withoutEnlargement?: boolean;
  quality?: number; // Качество WebP (1-100)
}

export type ResizePresetType =
  | 'CAROUSEL'
  | 'PRODUCT'
  | 'CATEGORY'
  | 'BRAND_LOGO';

// Предустановленные настройки для разных типов контента
export const RESIZE_PRESETS: Record<ResizePresetType, ResizeOptions> = {
  CAROUSEL: {
    width: 1920,
    height: 1080,
    // fit: 'inside',
    // withoutEnlargement: true,
    quality: 85,
  },

  PRODUCT: {
    width: 800,
    height: 800,
    // fit: 'cover',
    // withoutEnlargement: true,
    quality: 60,
  },

  CATEGORY: {
    width: 600,
    height: 400,
    // fit: 'cover',
    withoutEnlargement: true,
    quality: 60,
  },

  BRAND_LOGO: {
    width: 400,
    height: 200,
    // fit: 'contain',
    withoutEnlargement: true,
    quality: 60,
  },
};

@Injectable()
export class ImageProcessorService {
  async convertToWebP(
    file: Express.Multer.File,
    destinationFolder: string,
    options?: ResizeOptions | ResizePresetType,
  ): Promise<string> {
    // Создаем директорию, если она не существует
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    // Генерируем уникальное имя файла
    const filename = `${crypto.randomUUID()}.webp`;
    const outputPath = path.join(destinationFolder, filename);

    // Получаем параметры resize
    let resizeOptions: ResizeOptions | undefined;

    if (typeof options === 'string' && options in RESIZE_PRESETS) {
      // Если передано имя пресета
      resizeOptions = RESIZE_PRESETS[options];
    } else if (options && typeof options !== 'string') {
      // Если переданы конкретные параметры
      resizeOptions = options;
    }

    // Качество для WebP
    const quality = resizeOptions?.quality || 80;

    // Создаем экземпляр Sharp
    let sharpInstance = sharp(file.buffer);

    // Применяем resize, если заданы параметры
    if (resizeOptions) {
      const { width, height, fit, withoutEnlargement } = resizeOptions;

      if (width || height) {
        sharpInstance = sharpInstance.resize({
          width,
          height,
          fit: fit || 'inside',
          withoutEnlargement: withoutEnlargement !== false,
        });
      }
    }

    // Конвертируем в WebP
    sharpInstance = sharpInstance.webp({ quality });

    // Сохраняем изображение
    await sharpInstance.toFile(outputPath);

    // Возвращаем путь к файлу относительно public директории
    return destinationFolder.replace('./public', '') + '/' + filename;
  }
}

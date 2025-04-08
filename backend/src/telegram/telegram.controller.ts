import { Controller, Get } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('test')
  async sendTestMessage() {
    try {
      await this.telegramService.sendMessage('Тестовое сообщение от бота!');
      return { success: true, message: 'Сообщение отправлено в Telegram' };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка отправки сообщения',
        error: error,
      };
    }
  }

  @Get('config')
  getConfig() {
    return {
      token: !!process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
      botInitialized: !!this.telegramService['bot'],
    };
  }
}

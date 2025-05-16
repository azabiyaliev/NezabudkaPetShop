import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  private readonly logger = new Logger(TelegramService.name);
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;

  constructor() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN не указан');
    }
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: false,
    });
  }

  async sendMessage(message: string) {
    if (!this.chatId) {
      this.logger.warn('TELEGRAM_CHAT_ID не указан — сообщение не отправлено');
      return;
    }

    try {
      await this.bot.sendMessage(this.chatId, message);
    } catch (error) {
      this.logger.error('Ошибка отправки сообщения в Telegram:', error);
    }
  }
}

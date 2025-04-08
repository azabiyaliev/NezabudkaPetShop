import { BadRequestException, Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  private chatId = process.env.TELEGRAM_CHAT_ID;

  constructor() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new BadRequestException('TELEGRAM_BOT_TOKEN не указан');
    }
    if (!this.chatId) {
      throw new BadRequestException('TELEGRAM_CHAT_ID не указан');
    }
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: false,
    });
  }

  async sendMessage(message: string) {
    try {
      if (!this.chatId) {
        throw new BadRequestException('TELEGRAM_CHAT_ID не указан');
      }
      await this.bot.sendMessage(this.chatId, message);
    } catch (error) {
      console.error('Ошибка отправки сообщения в Telegram:', error);
      throw new Error('Ошибка отправки сообщения в Telegram');
    }
  }
}

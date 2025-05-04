import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface RecaptchaResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

@Injectable()
export class RecaptchaService {
  private readonly secretKey = process.env.RECAPTCHA_SECRET;
  private readonly verifyUrl =
    'https://www.google.com/recaptcha/api/siteverify';

  constructor() {
    if (!this.secretKey) {
      throw new Error('RECAPTCHA_SECRET is not defined');
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    if (!token) return false;
    try {
      const response = await axios.post<RecaptchaResponse>(
        this.verifyUrl,
        {},
        {
          params: { secret: this.secretKey, response: token },
          timeout: 3000,
        },
      );
      return response.data.success;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return false;
    }
  }
}

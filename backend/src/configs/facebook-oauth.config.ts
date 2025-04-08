import { registerAs } from '@nestjs/config';

export default registerAs('facebook-oauth', () => ({
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
}));

import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecretKey: process.env.STRIPE_WEBHOOK_SECRET_KEY,
}));

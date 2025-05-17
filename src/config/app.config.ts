import { registerAs } from '@nestjs/config';

export default registerAs('environment', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
}));

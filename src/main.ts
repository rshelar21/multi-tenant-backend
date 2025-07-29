import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    origin: (origin, callback) => {
      const allowedRoot = 'https://funroad.site';
      const subdomainRegex = /^https:\/\/([a-z0-9-]+)\.funroad\.site$/;

      if (
        !origin || // allow requests without origin (e.g., Postman, curl)
        origin === allowedRoot ||
        subdomainRegex.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE,PATCH', // Allow HTTP methods
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200,
    exposedHeaders: ['set-cookie'],
  });
  app.useLogger(app.get(Logger));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

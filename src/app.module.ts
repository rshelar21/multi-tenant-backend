import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { UsersModule } from './users/users.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { AuthModule } from './auth/auth.module';
import { RateLimitCreator } from './global/middleware';
import { AuthMiddleware } from 'src/auth/middlewares/auth.middleware';
import jwtConfig from './config/jwt.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { TagsModule } from './tags/tags.module';
import { PaginatioModule } from './global/pagination/pagination.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            {
              target: 'pino-http-print',
              level: 'debug',
              options: {
                destination: 1,
                all: true,
                colorize: true,
                translateTime: true,
              },
            },
          ],
        },
      },
    }),
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        /// now load from congif file appConfi
        type: 'postgres',
        synchronize: configService.get('database.synchronize'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        database: configService.get('database.name'),
      }),
    }),
    UsersModule,
    UserRolesModule,
    AuthModule,
    CategoryModule,
    ProductsModule,
    TagsModule,
    PaginatioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitCreator(60000, 60))
      .forRoutes('*')
      .apply(AuthMiddleware)
      .exclude(
        '/',
        '/auth/refresh-token',
        '/users/me',
        '/auth/sign-in',
        '/auth/sign-up',
      )
      .forRoutes('*');
  }
}

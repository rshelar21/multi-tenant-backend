import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './services/analytics.service';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Products } from 'src/products/products.entity';
import { Orders } from 'src/orders/orders.entity';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Products]),
    TypeOrmModule.forFeature([Orders]),
    ProductsModule,
    UsersModule,
  ],
})
export class AnalyticsModule {}

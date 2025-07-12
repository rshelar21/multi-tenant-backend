import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './services/orders.service';
import { Orders } from './orders.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { PaginatioModule } from 'src/global/pagination/pagination.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([Orders]),
    ProductsModule,
    PaginatioModule,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}

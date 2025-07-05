import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './services/products.service';
import { CategoryModule } from 'src/category/category.module';
import { TagsModule } from 'src/tags/tags.module';
import { PaginatioModule } from 'src/global/pagination/pagination.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Products]),
    CategoryModule,
    TagsModule,
    PaginatioModule,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}

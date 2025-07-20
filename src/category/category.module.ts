import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { SubCategory } from './sub-category.entity';
import { CategoryService } from './services/category.service';
import { CategoryController } from './category.controller';
import { SubCategoryService } from './services/sub-category.service';
import { PaginatioModule } from 'src/global/pagination/pagination.module';

@Module({
  providers: [CategoryService, SubCategoryService],
  controllers: [CategoryController],
  imports: [TypeOrmModule.forFeature([Category, SubCategory]), PaginatioModule],
  exports: [SubCategoryService],
})
export class CategoryModule {}

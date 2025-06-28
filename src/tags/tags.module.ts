import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './services/tags.service';
import { Tags } from './tags.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginatioModule } from 'src/global/pagination/pagination.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [TypeOrmModule.forFeature([Tags]), PaginatioModule],
  exports: [TagsService],
})
export class TagsModule {}

import { Module } from '@nestjs/common';
import { PaginationProvider } from './services/pagination.provider';

@Module({
  providers: [PaginationProvider],
  exports: [PaginationProvider],
})
export class PaginatioModule {}

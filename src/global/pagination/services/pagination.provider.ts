import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import {
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  FindOptionsRelations,
  FindOptionsSelect,
} from 'typeorm';
import { Paginated } from '../interface/pagination.interface';

@Injectable()
export class PaginationProvider {
  constructor() {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T>,
  ): Promise<Paginated<T>> {
    // find-count
    const [data, count] = await repository.findAndCount({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
      where,
      relations,
      select,
    });

    // calc page numbers

    const totalItems = count; //await repository.count()
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);

    const hasNextPage =
      paginationQuery.page === totalPages || totalPages === 0 ? false : true;
    const nextPage =
      paginationQuery.page === totalPages || totalPages === 0
        ? paginationQuery.page
        : paginationQuery.page + 1;

    const previoudPage =
      paginationQuery.page === 1 || totalPages === 0
        ? paginationQuery.page
        : paginationQuery.page - 1;

    const finalResponse: Paginated<T> = {
      data: data,
      meta: {
        totalItems,
        totalPages,
        nextPage,
        previoudPage,
        hasNextPage,
      },
    };

    return finalResponse;
  }
}

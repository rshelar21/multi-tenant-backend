import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsString,
  IsOptional,
  IsIn,
  Min,
  IsDateString,
  IsPositive,
} from 'class-validator';
import { DEFAULT_PAGE_LIMIT } from '../constants/query-params';

export class AccessParams {
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user'])
  access?: 'admin' | 'user';
}

export class GenericQueryParams extends AccessParams {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = DEFAULT_PAGE_LIMIT;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  @Transform(({ value }) => value?.toUpperCase())
  sortByOrder?: 'asc' | 'desc' | 'ASC' | 'DESC';
}

import { GenericQueryParams } from 'src/global/dto/generic-query-params.dto';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ReviewsQueryParms extends GenericQueryParams {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;
}

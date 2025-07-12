import { GenericQueryParams } from 'src/global/dto/generic-query-params.dto';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class OrdersQueryParms extends GenericQueryParams {
  @IsOptional()
  @IsString()
  productId: string;
}

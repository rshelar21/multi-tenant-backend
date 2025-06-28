import { GenericQueryParams } from 'src/global/dto/generic-query-params.dto';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';

export class ProductsQueryParms extends GenericQueryParams {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  parentSlug?: string;

  @IsOptional()
  @IsString()
  minPrice?: string;

  @IsOptional()
  @IsString()
  maxPrice?: string;

  // @IsArray()
  @IsString({ each: true })
  @IsOptional()
  // @ValidateNested({ each: true })
  tags?: string[];
}

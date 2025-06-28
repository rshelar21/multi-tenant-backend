import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class SubCategory {
  @IsString()
  @IsNotEmpty()
  @MaxLength(96)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  slug: string;
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(96)
  name: string;

  @IsString()
  @MaxLength(96)
  @IsOptional()
  color?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  slug: string;

  @IsArray()
  // @ValidateNested({ each: true })
  @IsOptional()
  subCategories?: string[];
}

export class CreateManyCategoryDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  category: CreateCategoryDto[];
}

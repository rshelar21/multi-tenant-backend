import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(96)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  slug: string;
}

export class CreateManySubCategoryDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSubCategoryDto)
  category: CreateSubCategoryDto[];
}

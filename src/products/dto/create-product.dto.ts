import {
  IsArray,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { RefundPolicy } from '../enums/refund-policy.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(112)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(96)
  price: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(512)
  productImg?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(RefundPolicy)
  refundPolicy: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class ContentDto {
  @IsJSON()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}

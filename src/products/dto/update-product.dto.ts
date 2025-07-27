import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class PatcProductDto extends PartialType(CreateProductDto) {
//   @IsString()
//   @IsNotEmpty()
//   id: string;
}
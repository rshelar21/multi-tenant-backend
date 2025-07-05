import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateCheckoutDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ArrayUnique()
  productIds: string[];

  @IsString()
  @IsNotEmpty()
  tenantSlug: string;
}

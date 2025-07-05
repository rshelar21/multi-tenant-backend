import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { User } from 'src/users/user.entity';

export class CreateOrderDto {
//   @IsString()
//   @IsNotEmpty()
//   @MaxLength(96)
//   name: string;

  @IsString()
  @IsNotEmpty()
  stripeCheckoutSessionId: string;

  user: User;

  @IsArray()
  productIds: string[];
}

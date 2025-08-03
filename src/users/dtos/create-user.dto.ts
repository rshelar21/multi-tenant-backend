import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  roles: number[];

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(512)
  storeImg?: string;
}

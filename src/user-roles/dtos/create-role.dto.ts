import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRolesIdType, UserRolesType } from '../enums/user-roles.enum';

export class CreateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRolesType)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRolesIdType)
  roleType: number;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserRoleDto } from './create-role.dto';
import { PartialType } from '@nestjs/mapped-types';

export class PatchRoleDto extends PartialType(CreateUserRoleDto) {
  @IsString()
  @IsNotEmpty()
  id: string;
}

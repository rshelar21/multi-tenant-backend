import { IsArray, IsNumber } from 'class-validator';

export class FindUserRoles {
  @IsArray()
  @IsNumber()
  roleIds: number[];
}

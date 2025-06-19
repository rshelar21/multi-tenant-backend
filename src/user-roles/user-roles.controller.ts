import { Body, Controller, Get, Post, Patch } from '@nestjs/common';
import { UserRolesService } from './services/user-roles.service';
import { CreateUserRoleDto } from './dtos/create-role.dto';
import { PatchRoleDto } from './dtos/update-role.dto';
import { FindUserRoles } from './dtos/find-roles.dto';

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Get()
  public getAllRoles() {
    return this.userRolesService.getAllRoles();
  }

  @Get('/roles')
  public getRoles(@Body() findUserRoles: FindUserRoles) {
    return this.userRolesService.getRoles(findUserRoles);
  }

  @Post()
  public createRole(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRolesService.createRole(createUserRoleDto);
  }

  @Patch()
  public updateRole(@Body() patchRoleDto: PatchRoleDto) {
    return this.userRolesService.updateRole(patchRoleDto);
  }
}

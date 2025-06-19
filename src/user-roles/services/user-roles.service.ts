import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoles } from '../user-roles.entity';
import { Repository, In } from 'typeorm';
import { CreateUserRoleDto } from '../dtos/create-role.dto';
import { PatchRoleDto } from '../dtos/update-role.dto';
import { FindUserRoles } from '../dtos/find-roles.dto';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
  ) {}

  public async createRole(createUserRoleDto: CreateUserRoleDto) {
    try {
      const existingRole = await this.userRolesRepository.findOne({
        where: {
          name: createUserRoleDto.name,
        },
      });

      if (existingRole) {
        throw new BadRequestException('Role already exist');
      }

      const newRole = await this.userRolesRepository.create({
        ...createUserRoleDto,
      });

      return await this.userRolesRepository.save(newRole);
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to create role',
        err.message,
      );
    }
  }

  public async getAllRoles() {
    try {
      const rolesList = await this.userRolesRepository.find();
      return rolesList;
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async updateRole(patchRoleDto: PatchRoleDto) {
    try {
      const existingRole = await this.userRolesRepository.findOneBy({
        id: patchRoleDto.id,
      });

      if (!existingRole) {
        throw new BadRequestException('Role not found');
      }

      return await this.userRolesRepository.update(
        {
          id: patchRoleDto.id,
        },
        {
          ...existingRole,
          name: patchRoleDto?.name,
          roleType: patchRoleDto?.roleType,
        },
      );
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to update role',
        err.message,
      );
    }
  }

  public async deleteRole(id: string) {
    try {
      const existingRole = await this.userRolesRepository.findOneBy({
        id,
      });

      if (!existingRole) {
        throw new BadRequestException('Role not found');
      }

      return await this.userRolesRepository.delete(id);
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to delete role',
        err.message,
      );
    }
  }

  public async getRoles(findUserRoles: FindUserRoles) {
    try {
      const [data, count] = await this.userRolesRepository.findAndCount({
        where: {
          roleType: In(findUserRoles.roleIds),
        },
      });
      return { data, count };
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }
}

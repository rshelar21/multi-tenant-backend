import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRolesService } from 'src/user-roles/services/user-roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userRolesService: UserRolesService,
  ) {}

  public async getAllUsers() {
    try {
      const [data, count] = await this.userRepository.findAndCount();

      return { data, count };
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to fetch users',
        err.message,
      );
    }
  }

  public async getUser(userId: string) {
    try {
      const user = await this.userRepository.findOneBy({
        id: userId,
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return user;
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to fetch user',
        err.message,
      );
    }
  }

  public async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new BadRequestException('an user with this email already exists');
      }
      const roles = await this.userRolesService.getRoles({
        roleIds: createUserDto.roles,
      });

      if (roles.count === 0) {
        throw new BadRequestException('Roles not found');
      }

      const user = await this.userRepository.create({
        ...createUserDto,
        roles: roles.data,
      });

      return await this.userRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to create user',
        err.message,
      );
    }
  }
}

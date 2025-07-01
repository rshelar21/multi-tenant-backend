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
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { Tenant } from 'src/tenants/tenants.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashingProvider: HashingProvider,

    private readonly userRolesService: UserRolesService,

    private readonly generateTokensProvider: GenerateTokensProvider,

    // private readonly tenants
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
      // const defaultRole = [3]; // User
      const existingUser = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new BadRequestException('an user with this email already exists');
      }

      const existingUsername = await this.userRepository.findOneBy({
        username: createUserDto?.username,
      });

      if (existingUsername) {
        throw new BadRequestException(
          'an user with this username already exists',
        );
      }

      const roles = await this.userRolesService.getRoles({
        roleIds: createUserDto.roles,
      });

      if (roles.count === 0) {
        throw new BadRequestException('Roles not found');
      }
      const newPassord = await this.hashingProvider.hashPassword(
        createUserDto?.password,
      );

      const user = await this.userRepository.create({
        ...createUserDto,
        roles: roles.data,
        password: newPassord,
      });

      const tenant = new Tenant();
      tenant.name = createUserDto?.username;
      tenant.slug = createUserDto?.username;
      tenant.stripeAccountId = 'TEST1';
      tenant.stripeDetailsSubmitted = true;

      user.tenant = tenant;

      const newuser = await this.userRepository.save(user);
      return instanceToPlain(newuser);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to create user',
        err.message,
      );
    }
  }

  public async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new BadRequestException('user not found');
    }

    return user;
  }

  public async getMe(
    req: Request & {
      user?: User;
    },
    res: Response,
  ) {
    const user = req?.user;

    const tokens = await this.generateTokensProvider.generateTokens(user);

    res
      .cookie('refreshToken', tokens?.refreshToken, {
        httpOnly: true, // JS can't access this cookie
        // secure: true, // use HTTPS
        // sameSite: 'lax', // CSRF protection
        maxAge: 30 * 60 * 1000, // 1 day
      })
      .json({
        user,
        accessToken: tokens?.accessToken,
      });
  }
}

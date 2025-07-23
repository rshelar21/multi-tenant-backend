import Stripe from 'stripe';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRolesService } from 'src/user-roles/services/user-roles.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { Tenant } from 'src/tenants/tenants.entity';
import stripeConfig from 'src/config/stripe.config';
import { ConfigType } from '@nestjs/config';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserRoles } from 'src/user-roles/user-roles.entity';
import { UserRolesIdType } from 'src/user-roles/enums/user-roles.enum';
@Injectable()
export class UsersService {
  private stripe: Stripe;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashingProvider: HashingProvider,

    private readonly userRolesService: UserRolesService,

    private readonly generateTokensProvider: GenerateTokensProvider,

    @Inject(stripeConfig.KEY)
    private readonly stripeConfiguration: ConfigType<typeof stripeConfig>,

    private readonly datasource: DataSource,
  ) {
    this.stripe = new Stripe(
      this.stripeConfiguration.stripeSecretKey as string,
    );
  }

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

      const account = await this.stripe.accounts.create({
        email: createUserDto?.email,
      });

      if (!account?.id) {
        throw new BadRequestException('Failed to create stripe account');
      }

      const tenant = new Tenant();
      tenant.name = createUserDto?.username;
      tenant.slug = createUserDto?.username;
      tenant.stripeAccountId = account?.id;
      tenant.stripeDetailsSubmitted = false;

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
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: {
        email: true,
        password: true,
        id: true,
        name: true,
        tenant: true,
      },
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
        secure:
          process.env.NODE_ENV === 'production' ||
          process.env.NODE_ENV === 'development', // use HTTPS
        maxAge: 30 * 60 * 1000, // 1 day
        sameSite: 'none',
      })
      .json({
        user,
        accessToken: tokens?.accessToken,
      });
  }

  public async updateUser(updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          id: updateUserDto.id,
        },
        relations: {
          roles: true,
        },
      });

      if (!existingUser) {
        throw new BadRequestException('User not found!');
      }

      let roles: UserRoles[] = [];

      if (updateUserDto.roles?.includes(UserRolesIdType.SUPER_ADMIN)) {
        throw new BadRequestException('Can not add roles');
      }

      if (updateUserDto.roles) {
        const rolesResult = await this.userRolesService.getRoles({
          roleIds: updateUserDto.roles,
        });
        roles = rolesResult?.data;
      }

      if (roles.length > 0) {
        // If you want to merge:
        existingUser.roles = Array.from(
          new Set([...existingUser.roles, ...roles]),
        );
      }

      await this.userRepository.save(existingUser);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to update user',
        err.message,
      );
    }
  }
}

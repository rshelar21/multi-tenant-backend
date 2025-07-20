import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignUpDto } from '../dto/signUp.dto';
import { SignInDto } from '../dto/signIn.dto';

import { UsersService } from 'src/users/services/users.service';
import { RefreshTokenProvider } from './refresh-token.provider';
import { Request, Response } from 'express';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { HashingProvider } from '../providers/hashing.provider';
import { RequestType } from '../../global/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly refreshTokenProvider: RefreshTokenProvider,
    private readonly generateTokenProvider: GenerateTokensProvider,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async signIn(signInDto: SignInDto, res: Response) {
    try {
      const user = await this.usersService.findUserByEmail(signInDto.email);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isPasswordMatch = await this.hashingProvider.comparePassword(
        signInDto.password,
        user?.password,
      );

      if (!isPasswordMatch) {
        throw new BadRequestException('User not found');
      }

      const token = await this.generateTokenProvider.generateTokens(user);
      if (!token || !token.refreshToken || !token.accessToken) {
        throw new InternalServerErrorException('Token generation failed');
      }

      res
        .cookie('refreshToken', token?.refreshToken, {
          httpOnly: true, // JS can't access this cookie
          secure: process.env.NODE_ENV === 'production', // use HTTPS
          // sameSite: 'lax', // CSRF protection // none
          maxAge: 30 * 60 * 1000, // 1 day
        })
        .json({
          user,
          accessToken: token?.accessToken,
        });
    } catch (err) {
      console.log(err)
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to login user',
        err.message,
      );
    }
  }

  public async signUp(signInDto: SignUpDto, res: Response) {
    try {
      const user = await this.usersService.createUser({
        ...signInDto,
        roles: signInDto?.roles || [3], // default role
      });

      const token = await this.generateTokenProvider.generateTokens(user);
      if (!token || !token.refreshToken || !token.accessToken) {
        throw new InternalServerErrorException('Token generation failed');
      }

      res
        .cookie('refreshToken', token?.refreshToken, {
          httpOnly: true, // JS can't access this cookie
          secure: process.env.NODE_ENV === 'production', // use HTTPS
          // sameSite: 'lax', // CSRF protection
          maxAge: 30 * 60 * 1000, // 1 day
        })
        .json({
          user,
          accessToken: token?.accessToken,
        });
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

  public logout(req: RequestType, res: Response) {
    try {
      const userId = req?.user;

      res.clearCookie('refreshToken').json({
        message: 'Logout success!',
      });
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

  public refreshtoken(req: Request, res: Response) {
    return this.refreshTokenProvider.refreshToken(req, res);
  }
}

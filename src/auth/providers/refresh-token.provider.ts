import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { UsersService } from 'src/users/services/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { User } from 'src/users/user.entity';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly usersService: UsersService,

    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async refreshToken(
    req: Request & {
      user?: User;
    },
    res: Response,
  ) {
    try {
      const user = req?.user;
      // const token = req.cookies.refreshToken;
      // if (!token) {
      //   throw new BadRequestException('token not found');
      // }
      // const { sub } = await this.jwtService.verifyAsync(token, {
      //   secret: this.jwtConfiguration.secret,
      //   audience: this.jwtConfiguration.audience,
      //   issuer: this.jwtConfiguration.issuer,
      // });

      // // Fetch the user from the database
      // const user = await this.usersService.getUser(sub);
      // // Generate the tokens
      const tokens = await this.generateTokensProvider.generateTokens(user);

      res
        .cookie('refreshToken', tokens?.refreshToken, {
          httpOnly: true, // JS can't access this cookie
          secure:
            process.env.NODE_ENV === 'production' ||
            process.env.NODE_ENV === 'development', // use HTTPS
          maxAge: 30 * 60 * 1000, // 1 day
          sameSite:
            process.env.NODE_ENV === 'production' ||
            process.env.NODE_ENV === 'development'
              ? 'none'
              : 'lax', // CSRF protection // none
        })
        .json({
          user,
          accessToken: tokens?.accessToken,
        });
    } catch (err) {}
  }
}

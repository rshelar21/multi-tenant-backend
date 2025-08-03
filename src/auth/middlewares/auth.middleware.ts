import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import jwtConfig from 'src/config/jwt.config';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    // ineject jwt service
    private readonly jwtService: JwtService,

    //inject jwt config
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly usersService: UsersService,
  ) {}

  async use(
    req: Request & {
      user?: User;
    },
    res: Response,
    next: NextFunction,
  ) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('Access Token not found');
    }

    try {
      const { sub } = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersService.getUser(sub);

      req.user = user;

      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Access token has expired');
      }
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(req: Request) {
    const [_, token] = req.get('Authorization')?.split(' ') ?? [];
    return token;
  }
}

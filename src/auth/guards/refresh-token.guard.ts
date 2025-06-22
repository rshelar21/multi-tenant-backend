import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    // ineject jwt service
    private readonly jwtService: JwtService,

    //inject jwt config
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies.refreshToken;

    if (!token) {
      throw new UnauthorizedException('token not found');
    }

    try {
      const { sub } = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersService.getUser(sub);

      request.user = user;
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }
}

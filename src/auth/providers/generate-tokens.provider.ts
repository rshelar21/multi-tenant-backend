import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(userId, expiresIn, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  public async generateTokens(user) {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
          email: user.email,
        }),
        this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
      ]);
      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {}
  }
}

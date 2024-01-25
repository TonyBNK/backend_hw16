import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ExpiredTokensQueryRepository } from '../../expired-tokens/expired-tokens.query-repository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private expiredTokensQueryRepository: ExpiredTokensQueryRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Token is missing.');
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Token expired.');
    }

    const expiredToken =
      await this.expiredTokensQueryRepository.getExpiredToken(refreshToken);

    if (expiredToken) {
      throw new UnauthorizedException('Token expired.');
    }

    return true;
  }
}

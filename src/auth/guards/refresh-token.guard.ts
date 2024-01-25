import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExpiredTokensQueryRepository } from '../../expired-tokens/expired-tokens.query-repository';
import { jwtConstants } from '../constants';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private expiredTokensQueryRepository: ExpiredTokensQueryRepository,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Token is missing.');
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
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

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SecurityDevicesQueryRepository } from '../security-devices.query-repository';

@Injectable()
export class OwnSecurityDeviceGuard implements CanActivate {
  constructor(
    private securityDevicesQueryRepository: SecurityDevicesQueryRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refreshToken'];
    const deviceId = request.params.deviceId;

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const securityDevice =
      await this.securityDevicesQueryRepository.getSecurityDeviceById(deviceId);

    const isOwn = payload.sub === securityDevice!.userId;

    if (!isOwn) {
      throw new ForbiddenException('This device does not belong to you.');
    }

    return true;
  }
}

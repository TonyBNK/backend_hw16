import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';
import { SecurityDevicesQueryRepository } from '../security-devices.query-repository';

@Injectable()
export class OwnSecurityDeviceGuard implements CanActivate {
  constructor(
    private securityDevicesQueryRepository: SecurityDevicesQueryRepository,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refreshToken'];
    const deviceId = request.params.deviceId;

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: jwtConstants.secret,
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

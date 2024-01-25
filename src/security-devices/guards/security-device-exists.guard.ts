import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SecurityDevicesQueryRepository } from '../security-devices.query-repository';

@Injectable()
export class SecurityDeviceExistsGuard implements CanActivate {
  constructor(
    private securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const id = request.params.deviceId || request.params.id;

    const securityDevice =
      await this.securityDevicesQueryRepository.getSecurityDeviceById(id);

    if (!securityDevice) {
      throw new NotFoundException('Such device does not exist!');
    }

    return true;
  }
}

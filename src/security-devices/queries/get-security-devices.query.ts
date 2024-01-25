import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';
import { SecurityDeviceDocument } from '../security-device.schema';
import { SecurityDevicesQueryRepository } from '../security-devices.query-repository';

export class GetSecurityDevicesQuery {
  constructor(public readonly refreshToken: string) {}
}

@QueryHandler(GetSecurityDevicesQuery)
export class GetSecurityDevicesHandler
  implements IQueryHandler<GetSecurityDevicesQuery>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async execute({
    refreshToken,
  }: GetSecurityDevicesQuery): Promise<Array<SecurityDeviceDocument>> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: jwtConstants.secret,
    });

    return this.securityDevicesQueryRepository.getSecurityDevicesForUser(
      payload.sub,
    );
  }
}

import { ConfigService } from '@nestjs/config';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
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
    private configService: ConfigService,
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async execute({
    refreshToken,
  }: GetSecurityDevicesQuery): Promise<Array<SecurityDeviceDocument>> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return this.securityDevicesQueryRepository.getSecurityDevicesForUser(
      payload.sub,
    );
  }
}

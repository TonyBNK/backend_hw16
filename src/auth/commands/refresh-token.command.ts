import { UnauthorizedException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { CreateExpiredTokenCommand } from '../../expired-tokens/commands';
import { SecurityDevicesQueryRepository } from '../../security-devices/security-devices.query-repository';
import { SecurityDevicesRepository } from '../../security-devices/security-devices.repository';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../constants';

export class RefreshTokenCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private commandBus: CommandBus,
    private authService: AuthService,

    private securityDevicesRepository: SecurityDevicesRepository,
    private securityDevicesQueryRepository: SecurityDevicesQueryRepository,
    private jwtService: JwtService,
  ) {}

  async execute({
    refreshToken,
  }: RefreshTokenCommand): ReturnType<typeof this.authService.generateTokens> {
    const { sub, login, deviceId } = await this.jwtService.verifyAsync(
      refreshToken,
      {
        secret: jwtConstants.secret,
      },
    );

    await this.commandBus.execute(
      new CreateExpiredTokenCommand({ token: refreshToken }),
    );

    const securityDevice =
      await this.securityDevicesQueryRepository.getSecurityDeviceById(deviceId);

    if (!securityDevice) {
      throw new UnauthorizedException('Can not get security device.');
    }

    const tokens = await this.authService.generateTokens(sub, login, deviceId);

    const payload = await this.jwtService.verifyAsync(tokens.refreshToken, {
      secret: jwtConstants.secret,
    });

    securityDevice.issueDate = new Date(payload.iat * 1000).toISOString();

    await this.securityDevicesRepository.save(securityDevice);

    return tokens;
  }
}

import { BadRequestException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { CreateSecurityDeviceCommand } from '../../security-devices/commands';
import { SecurityDevicesQueryRepository } from '../../security-devices/security-devices.query-repository';
import { SecurityDevicesRepository } from '../../security-devices/security-devices.repository';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../constants';
import { LoginUserDto } from '../dto';

export class LoginUserCommand {
  constructor(public readonly loginUserDto: LoginUserDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private commandBus: CommandBus,
    private authService: AuthService,

    private securityDevicesRepository: SecurityDevicesRepository,
    private securityDevicesQueryRepository: SecurityDevicesQueryRepository,
    private jwtService: JwtService,
  ) {}

  async execute({
    loginUserDto: { userId, userLogin, deviceTitle, deviceIp },
  }: LoginUserCommand): ReturnType<typeof this.authService.generateTokens> {
    let securityDevice =
      await this.securityDevicesQueryRepository.getSecurityDeviceByInfo(
        userId,
        deviceTitle,
        deviceIp,
      );

    if (!securityDevice) {
      securityDevice = await this.commandBus.execute(
        new CreateSecurityDeviceCommand({
          ip: deviceIp,
          title: deviceTitle,
          userId,
        }),
      );
    }

    if (!securityDevice) {
      throw new BadRequestException('Can not get security device.');
    }

    const deviceId = securityDevice._id.toString();

    const tokens = await this.authService.generateTokens(
      userId,
      userLogin,
      deviceId,
    );

    const payload = await this.jwtService.verifyAsync(tokens.refreshToken, {
      secret: jwtConstants.secret,
    });

    securityDevice.issueDate = new Date(payload.iat * 1000).toISOString();

    await this.securityDevicesRepository.save(securityDevice);

    return tokens;
  }
}

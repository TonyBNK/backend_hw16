import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { CreateExpiredTokenCommand } from '../../expired-tokens/commands';
import { DeleteSecurityDeviceCommand } from '../../security-devices/commands';
import { jwtConstants } from '../constants';

export class LogoutUserCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(
    private commandBus: CommandBus,
    private jwtService: JwtService,
  ) {}

  async execute({ refreshToken }: LogoutUserCommand) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: jwtConstants.secret,
    });

    await this.commandBus.execute(
      new CreateExpiredTokenCommand({ token: refreshToken }),
    );

    await this.commandBus.execute(
      new DeleteSecurityDeviceCommand(payload.deviceId),
    );
  }
}

import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityDevicesQueryRepository } from '../security-devices.query-repository';

export class DeleteSecurityDeviceCommand {
  constructor(
    public readonly id: string,
    // public readonly refreshToken: string,
  ) {}
}

@CommandHandler(DeleteSecurityDeviceCommand)
export class DeleteSecurityDeviceHandler
  implements ICommandHandler<DeleteSecurityDeviceCommand>
{
  constructor(
    private commandBus: CommandBus,
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async execute({
    id,
    // refreshToken,
  }: DeleteSecurityDeviceCommand): Promise<boolean> {
    const securityDevice =
      await this.securityDevicesQueryRepository.getSecurityDeviceById(id);

    if (!securityDevice) {
      return false;
    }

    const result = await securityDevice.deleteOne();

    // await this.commandBus.execute(
    //   new CreateExpiredTokenCommand({ token: refreshToken }),
    // );

    return result.acknowledged && !!result.deletedCount;
  }
}

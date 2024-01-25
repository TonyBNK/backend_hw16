import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityDevicesQueryRepository } from '../security-devices.query-repository';

export class DeleteSecurityDeviceCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteSecurityDeviceCommand)
export class DeleteSecurityDeviceHandler
  implements ICommandHandler<DeleteSecurityDeviceCommand>
{
  constructor(
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async execute({ id }: DeleteSecurityDeviceCommand): Promise<boolean> {
    const securityDevice =
      await this.securityDevicesQueryRepository.getSecurityDeviceById(id);

    if (!securityDevice) {
      return false;
    }

    const result = await securityDevice.deleteOne();

    return result.acknowledged && !!result.deletedCount;
  }
}

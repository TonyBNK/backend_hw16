import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSecurityDeviceDto } from '../dto';
import {
  SecurityDeviceDocument,
  SecurityDeviceModelType,
} from '../security-device.schema';
import { SecurityDevicesRepository } from '../security-devices.repository';

export class CreateSecurityDeviceCommand {
  constructor(public readonly securityDeviceDto: CreateSecurityDeviceDto) {}
}

@CommandHandler(CreateSecurityDeviceCommand)
export class CreateSecurityDeviceHandler
  implements ICommandHandler<CreateSecurityDeviceCommand>
{
  constructor(
    @InjectModel('SecurityDevice')
    private SecurityDeviceModel: SecurityDeviceModelType,
    private securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute({
    securityDeviceDto,
  }: CreateSecurityDeviceCommand): Promise<SecurityDeviceDocument> {
    const securityDevice = this.SecurityDeviceModel.createInstance(
      this.SecurityDeviceModel,
      securityDeviceDto,
    );

    return this.securityDevicesRepository.save(securityDevice);
  }
}

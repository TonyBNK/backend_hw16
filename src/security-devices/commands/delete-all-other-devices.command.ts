import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityDevice } from '../security-device.schema';

export class DeleteAllOtherDevicesCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(DeleteAllOtherDevicesCommand)
export class DeleteAllOtherDevicesHandler
  implements ICommandHandler<DeleteAllOtherDevicesCommand>
{
  constructor(
    @InjectModel(SecurityDevice.name)
    private SecurityDeviceModel: Model<SecurityDevice>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async execute({
    refreshToken,
  }: DeleteAllOtherDevicesCommand): Promise<boolean> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const result = await this.SecurityDeviceModel.deleteMany({
      userId: payload.sub,
      _id: { $ne: payload.deviceId },
    });

    return result.acknowledged && !!result.deletedCount;
  }
}

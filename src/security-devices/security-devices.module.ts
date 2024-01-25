import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpiredTokensModule } from '../expired-tokens/expired-tokens.module';
import {
  CreateSecurityDeviceHandler,
  DeleteAllOtherDevicesHandler,
  DeleteSecurityDeviceHandler,
} from './commands';
import { GetSecurityDevicesHandler } from './queries';
import { SecurityDevice, SecurityDeviceSchema } from './security-device.schema';
import { SecurityDevicesController } from './security-devices.controller';
import { SecurityDevicesQueryRepository } from './security-devices.query-repository';
import { SecurityDevicesRepository } from './security-devices.repository';

const SecurityDeviceModel = {
  name: SecurityDevice.name,
  schema: SecurityDeviceSchema,
};
const Services = [SecurityDevicesRepository, SecurityDevicesQueryRepository];
const CommandHandlers = [
  CreateSecurityDeviceHandler,
  DeleteAllOtherDevicesHandler,
  DeleteSecurityDeviceHandler,
];
const QueryHandlers = [GetSecurityDevicesHandler];

@Module({
  imports: [
    MongooseModule.forFeature([SecurityDeviceModel]),
    ExpiredTokensModule,
    CqrsModule,
  ],
  controllers: [SecurityDevicesController],
  providers: [...Services, ...CommandHandlers, ...QueryHandlers],
  exports: [
    MongooseModule.forFeature([SecurityDeviceModel]),
    SecurityDevicesRepository,
    SecurityDevicesQueryRepository,
  ],
})
export class SecurityDevicesModule {}

import { Injectable } from '@nestjs/common';
import { SecurityDeviceDocument } from './security-device.schema';

@Injectable()
export class SecurityDevicesRepository {
  async save(model: SecurityDeviceDocument) {
    return model.save();
  }
}

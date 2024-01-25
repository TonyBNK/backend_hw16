import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SecurityDevice,
  SecurityDeviceDocument,
} from './security-device.schema';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private SecurityDeviceModel: Model<SecurityDevice>,
  ) {}

  async getSecurityDeviceById(
    id: string,
  ): Promise<SecurityDeviceDocument | null> {
    return this.SecurityDeviceModel.findById(id);
  }

  async getSecurityDeviceByInfo(
    userId: string,
    title: string,
    ip: string,
  ): Promise<SecurityDeviceDocument | null> {
    return this.SecurityDeviceModel.findOne({ userId, title, ip });
  }

  async getSecurityDevicesForUser(
    userId: string,
  ): Promise<Array<SecurityDeviceDocument>> {
    return this.SecurityDeviceModel.find({ userId });
  }
}

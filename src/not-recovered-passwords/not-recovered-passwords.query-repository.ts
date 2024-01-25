import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotRecoveredPassword,
  NotRecoveredPasswordDocument,
} from './not-recovered-password.schema';

@Injectable()
export class NotRecoveredPasswordsQueryRepository {
  constructor(
    @InjectModel(NotRecoveredPassword.name)
    private NotRecoveredPasswordModel: Model<NotRecoveredPassword>,
  ) {}

  async getNotRecoveredPasswordByEmail(
    email: string,
  ): Promise<NotRecoveredPasswordDocument | null> {
    return this.NotRecoveredPasswordModel.findOne({ email });
  }

  async getNotRecoveredPasswordByCode(
    recoveryCode: string,
  ): Promise<NotRecoveredPasswordDocument | null> {
    return this.NotRecoveredPasswordModel.findOne({ recoveryCode });
  }
}

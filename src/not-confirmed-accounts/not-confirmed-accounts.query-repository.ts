import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotConfirmedAccount,
  NotConfirmedAccountDocument,
} from './not-confirmed-account.schema';

@Injectable()
export class NotConfirmedAccountsQueryRepository {
  constructor(
    @InjectModel(NotConfirmedAccount.name)
    private NotConfirmedAccountModel: Model<NotConfirmedAccount>,
  ) {}

  async getNotConfirmedAccountByEmail(
    email: string,
  ): Promise<NotConfirmedAccountDocument | null> {
    return this.NotConfirmedAccountModel.findOne({ email });
  }

  async getNotConfirmedAccountByCode(
    confirmationCode: string,
  ): Promise<NotConfirmedAccountDocument | null> {
    return this.NotConfirmedAccountModel.findOne({ confirmationCode });
  }
}

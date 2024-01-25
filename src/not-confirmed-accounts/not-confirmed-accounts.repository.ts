import { Injectable } from '@nestjs/common';
import { NotConfirmedAccountDocument } from './not-confirmed-account.schema';

@Injectable()
export class NotConfirmedAccountsRepository {
  async save(model: NotConfirmedAccountDocument) {
    return model.save();
  }
}

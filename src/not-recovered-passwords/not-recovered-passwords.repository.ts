import { Injectable } from '@nestjs/common';
import { NotRecoveredPasswordDocument } from './not-recovered-password.schema';

@Injectable()
export class NotRecoveredPasswordsRepository {
  async save(model: NotRecoveredPasswordDocument) {
    return model.save();
  }
}

import { Injectable } from '@nestjs/common';
import { ExpiredTokenDocument } from './expired-token.schema';

@Injectable()
export class ExpiredTokensRepository {
  async save(model: ExpiredTokenDocument) {
    return model.save();
  }
}

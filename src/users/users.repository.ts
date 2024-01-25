import { Injectable } from '@nestjs/common';
import { UserDocument } from './user.schema';

@Injectable()
export class UsersRepository {
  async save(model: UserDocument) {
    return model.save();
  }
}

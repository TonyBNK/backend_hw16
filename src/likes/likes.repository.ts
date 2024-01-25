import { Injectable } from '@nestjs/common';
import { LikeDocument } from './like.schema';

@Injectable()
export class LikesRepository {
  async save(model: LikeDocument) {
    return model.save();
  }
}

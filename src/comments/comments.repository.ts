import { Injectable } from '@nestjs/common';
import { CommentDocument } from './comment.schema';

@Injectable()
export class CommentsRepository {
  async save(model: CommentDocument) {
    return model.save();
  }
}

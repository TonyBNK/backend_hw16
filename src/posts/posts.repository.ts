import { Injectable } from '@nestjs/common';
import { PostDocument } from './post.schema';

@Injectable()
export class PostsRepository {
  async save(model: PostDocument) {
    return model.save();
  }
}

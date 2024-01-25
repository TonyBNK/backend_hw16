import { Injectable } from '@nestjs/common';
import { BlogDocument } from './blog.schema';

@Injectable()
export class BlogsRepository {
  async save(model: BlogDocument) {
    return model.save();
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsQueryRepository } from '../posts.query-repository';

@Injectable()
export class PostExistsGuard implements CanActivate {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const id = request.params.postId || request.params.id;

    const post = await this.postsQueryRepository.getPostById(id);

    if (!post) {
      throw new NotFoundException('Such post does not exist!');
    }

    return true;
  }
}

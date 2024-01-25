import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../comments.query-repository';

@Injectable()
export class CommentExistsGuard implements CanActivate {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const id = request.params.commentId || request.params.id;

    const comment = await this.commentsQueryRepository.getCommentById(id);

    if (!comment) {
      throw new NotFoundException('Such comment does not exist!');
    }

    return true;
  }
}

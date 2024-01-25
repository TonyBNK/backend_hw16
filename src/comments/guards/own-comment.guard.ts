import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../comments.query-repository';

@Injectable()
export class OwnCommentGuard implements CanActivate {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const id = request.params.commentId || request.params.id;

    const comment = await this.commentsQueryRepository.getCommentById(id);

    const isOwn = request.user.id === comment!.commentatorInfo.userId;

    if (!isOwn) {
      throw new ForbiddenException('This comment does not belong to you.');
    }

    return true;
  }
}

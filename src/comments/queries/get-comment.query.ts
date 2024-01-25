import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LikeStatus, LikeableEntity } from '../../constants';
import { LikesQueryRepository } from '../../likes/likes.query-repository';
import { CommentDocument } from '../comment.schema';
import { CommentsQueryRepository } from '../comments.query-repository';

export class GetCommentQuery {
  constructor(
    public readonly commentId: string,
    public readonly userId?: string,
  ) {}
}

@QueryHandler(GetCommentQuery)
export class GetCommentHandler implements IQueryHandler<GetCommentQuery> {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({
    commentId,
    userId,
  }: GetCommentQuery): Promise<CommentDocument | null> {
    const comment =
      await this.commentsQueryRepository.getCommentById(commentId);

    if (!comment) {
      return null;
    }

    const [likesInfo, dislikesInfo] = await Promise.all([
      this.likesQueryRepository.getLikesCount({
        likeStatus: LikeStatus.Like,
        entityType: LikeableEntity.Comment,
      }),
      this.likesQueryRepository.getLikesCount({
        likeStatus: LikeStatus.Dislike,
        entityType: LikeableEntity.Comment,
      }),
    ]);

    comment.likesInfo = {
      likesCount: likesInfo[commentId] || 0,
      dislikesCount: dislikesInfo[commentId] || 0,
      myStatus: LikeStatus.None,
    };

    if (userId) {
      const userLikeStatusInfo =
        await this.likesQueryRepository.getUserLikeStatus({
          userId,
          entityType: LikeableEntity.Comment,
        });

      comment.likesInfo.myStatus =
        userLikeStatusInfo[commentId] || LikeStatus.None;
    }

    return comment;
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentDocument } from '../../comments/comment.schema';
import { GetCommentsDto } from '../../comments/dto';
import { LikeStatus, LikeableEntity } from '../../constants';
import { LikesQueryRepository } from '../../likes/likes.query-repository';
import { Paginator } from '../../types';
import { PostsQueryRepository } from '../posts.query-repository';

export class GetPostCommentsQuery {
  constructor(
    public readonly postId: string,
    public readonly queryParams?: GetCommentsDto,
    public readonly userId?: string,
  ) {}
}

@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsHandler
  implements IQueryHandler<GetPostCommentsQuery>
{
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({
    postId,
    queryParams,
    userId,
  }: GetPostCommentsQuery): Promise<Paginator<CommentDocument>> {
    const comments = await this.postsQueryRepository.getPostComments(
      postId,
      queryParams,
    );

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

    comments.items.map((comment) => {
      const commentId = comment._id.toString();

      comment.likesInfo = {
        likesCount: likesInfo[commentId] || 0,
        dislikesCount: dislikesInfo[commentId] || 0,
        myStatus: LikeStatus.None,
      };
    });

    if (userId) {
      const userLikeStatusInfo =
        await this.likesQueryRepository.getUserLikeStatus({
          userId,
          entityType: LikeableEntity.Comment,
        });

      comments.items.map((comment) => {
        const commentId = comment._id.toString();

        comment.likesInfo.myStatus =
          userLikeStatusInfo[commentId] || LikeStatus.None;
      });
    }

    return comments;
  }
}

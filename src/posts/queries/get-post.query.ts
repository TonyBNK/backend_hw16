import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LikeStatus, LikeableEntity } from '../../constants';
import { LikesQueryRepository } from '../../likes/likes.query-repository';
import { PostDocument } from '../post.schema';
import { PostsQueryRepository } from '../posts.query-repository';

export class GetPostQuery {
  constructor(
    public readonly postId: string,
    public readonly userId?: string,
  ) {}
}

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({
    postId,
    userId,
  }: GetPostQuery): Promise<PostDocument | null> {
    const post = await this.postsQueryRepository.getPostById(postId);

    if (!post) {
      return null;
    }

    const [likesInfo, dislikesInfo, newestLikesInfo] = await Promise.all([
      this.likesQueryRepository.getLikesCount({
        likeStatus: LikeStatus.Like,
        entityType: LikeableEntity.Post,
      }),
      this.likesQueryRepository.getLikesCount({
        likeStatus: LikeStatus.Dislike,
        entityType: LikeableEntity.Post,
      }),
      this.likesQueryRepository.getNewestLikes(),
    ]);

    post.extendedLikesInfo = {
      likesCount: likesInfo[postId] || 0,
      dislikesCount: dislikesInfo[postId] || 0,
      newestLikes: newestLikesInfo[postId] || [],
      myStatus: LikeStatus.None,
    };

    if (userId) {
      const userLikeStatusInfo =
        await this.likesQueryRepository.getUserLikeStatus({
          userId,
          entityType: LikeableEntity.Post,
        });

      post.extendedLikesInfo.myStatus =
        userLikeStatusInfo[postId] || LikeStatus.None;
    }

    return post;
  }
}

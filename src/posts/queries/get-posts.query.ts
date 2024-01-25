import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LikeStatus, LikeableEntity } from '../../constants';
import { LikesQueryRepository } from '../../likes/likes.query-repository';
import { Paginator } from '../../types';
import { GetPostsDto } from '../dto';
import { PostDocument } from '../post.schema';
import { PostsQueryRepository } from '../posts.query-repository';

export class GetPostsQuery {
  constructor(
    public readonly queryParams?: GetPostsDto,
    public readonly userId?: string,
  ) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({
    queryParams,
    userId,
  }: GetPostsQuery): Promise<Paginator<PostDocument>> {
    const posts = await this.postsQueryRepository.getPosts(queryParams);

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

    posts.items.map((post) => {
      const postId = post._id.toString();

      post.extendedLikesInfo = {
        likesCount: likesInfo[postId] || 0,
        dislikesCount: dislikesInfo[postId] || 0,
        newestLikes: newestLikesInfo[postId] || [],
        myStatus: LikeStatus.None,
      };
    });

    if (userId) {
      const userLikeStatusInfo =
        await this.likesQueryRepository.getUserLikeStatus({
          userId,
          entityType: LikeableEntity.Post,
        });

      posts.items.map((post) => {
        const postId = post._id.toString();

        post.extendedLikesInfo.myStatus =
          userLikeStatusInfo[postId] || LikeStatus.None;
      });
    }

    return posts;
  }
}

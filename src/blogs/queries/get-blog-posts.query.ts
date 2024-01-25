import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LikeStatus, LikeableEntity } from '../../constants';
import { LikesQueryRepository } from '../../likes/likes.query-repository';
import { GetPostsDto } from '../../posts/dto';
import { PostDocument } from '../../posts/post.schema';
import { Paginator } from '../../types';
import { BlogsQueryRepository } from '../blogs.query-repository';

export class GetBlogPostsQuery {
  constructor(
    public readonly blogId: string,
    public readonly queryParams?: GetPostsDto,
    public readonly userId?: string,
  ) {}
}

@QueryHandler(GetBlogPostsQuery)
export class GetBlogPostsHandler implements IQueryHandler<GetBlogPostsQuery> {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({
    blogId,
    queryParams,
    userId,
  }: GetBlogPostsQuery): Promise<Paginator<PostDocument>> {
    const posts = await this.blogsQueryRepository.getBlogPosts(
      blogId,
      queryParams,
    );

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

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../posts/post.schema';
import { PostsRepository } from '../../posts/posts.repository';
import { BlogsQueryRepository } from '../blogs.query-repository';
import { CreateBlogPostDto } from '../dto';

export class CreateBlogPostCommand {
  constructor(
    public readonly blogId: string,
    public readonly blogPostDto: CreateBlogPostDto,
  ) {}
}

@CommandHandler(CreateBlogPostCommand)
export class CreateBlogPostHandler
  implements ICommandHandler<CreateBlogPostCommand>
{
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    @InjectModel(Post.name) private PostModel: PostModelType,
    private postsRepository: PostsRepository,
  ) {}

  async execute({
    blogId,
    blogPostDto: { title, shortDescription, content },
  }: CreateBlogPostCommand): Promise<PostDocument | null> {
    const post = await this.PostModel.createInstance(
      this.PostModel,
      {
        blogId,
        title,
        shortDescription,
        content,
      },
      this.blogsQueryRepository,
    );

    return this.postsRepository.save(post);
  }
}

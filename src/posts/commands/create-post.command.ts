import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsQueryRepository } from '../../blogs/blogs.query-repository';
import { PostDocument, PostModelType } from '../../posts/post.schema';
import { PostsRepository } from '../../posts/posts.repository';
import { CreatePostDto } from '../dto';

export class CreatePostCommand {
  constructor(public readonly postDto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectModel('Post') private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute({ postDto }: CreatePostCommand): Promise<PostDocument | null> {
    const post = await this.PostModel.createInstance(
      this.PostModel,
      postDto,
      this.blogsQueryRepository,
    );

    return this.postsRepository.save(post);
  }
}

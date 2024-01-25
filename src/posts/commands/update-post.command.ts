import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../dto';
import { PostsQueryRepository } from '../posts.query-repository';
import { PostsRepository } from '../posts.repository';

export class UpdatePostCommand {
  constructor(
    public readonly id: string,
    public readonly postDto: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute({ id, postDto }: UpdatePostCommand): Promise<boolean> {
    const post = await this.postsQueryRepository.getPostById(id);

    if (!post) {
      return false;
    }

    Object.keys(postDto).forEach((key) => {
      post[key] = postDto[key];
    });

    const result = await this.postsRepository.save(post);

    return Boolean(result);
  }
}

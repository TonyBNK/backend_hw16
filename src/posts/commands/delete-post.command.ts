import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../posts.query-repository';

export class DeletePostCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async execute({ id }: DeletePostCommand): Promise<boolean> {
    const post = await this.postsQueryRepository.getPostById(id);

    if (!post) {
      return false;
    }

    const result = await post.deleteOne();

    return result.acknowledged && !!result.deletedCount;
  }
}

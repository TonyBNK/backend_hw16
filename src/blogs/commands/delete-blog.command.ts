import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../blogs.query-repository';

export class DeleteBlogCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<boolean> {
    const blog = await this.blogsQueryRepository.getBlogById(id);

    if (!blog) {
      return false;
    }

    const result = await blog.deleteOne();

    return result.acknowledged && !!result.deletedCount;
  }
}

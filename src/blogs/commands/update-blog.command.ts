import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../blogs.query-repository';
import { BlogsRepository } from '../blogs.repository';
import { UpdateBlogDto } from '../dto';

export class UpdateBlogCommand {
  constructor(
    public readonly id: string,
    public readonly blogDto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute({ id, blogDto }: UpdateBlogCommand): Promise<boolean> {
    const blog = await this.blogsQueryRepository.getBlogById(id);

    if (!blog) {
      return false;
    }

    Object.keys(blogDto).forEach((key) => {
      blog[key] = blogDto[key];
    });

    const result = await this.blogsRepository.save(blog);

    return Boolean(result);
  }
}

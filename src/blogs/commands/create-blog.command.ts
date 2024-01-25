import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDocument, BlogModelType } from '../blog.schema';
import { BlogsRepository } from '../blogs.repository';
import { CreateBlogDto } from '../dto';

export class CreateBlogCommand {
  constructor(public readonly blogDto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectModel('Blog') private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ blogDto }: CreateBlogCommand): Promise<BlogDocument> {
    const blog = this.BlogModel.createInstance(this.BlogModel, blogDto);

    return this.blogsRepository.save(blog);
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../blogs.query-repository';

@Injectable()
export class BlogExistsGuard implements CanActivate {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const id = request.params.blogId || request.params.id;

    const blog = await this.blogsQueryRepository.getBlogById(id);

    if (!blog) {
      throw new NotFoundException('Such blog does not exist!');
    }

    return true;
  }
}

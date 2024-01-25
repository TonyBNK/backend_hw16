import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesModule } from '../likes/likes.module';
import { PostsModule } from '../posts/posts.module';
import { Blog, BlogSchema } from './blog.schema';
import { BlogsController } from './blogs.controller';
import { BlogsQueryRepository } from './blogs.query-repository';
import { BlogsRepository } from './blogs.repository';
import {
  CreateBlogHandler,
  CreateBlogPostHandler,
  DeleteBlogHandler,
  UpdateBlogHandler,
} from './commands';
import { GetBlogPostsHandler } from './queries';

const BlogModel = { name: Blog.name, schema: BlogSchema };
const Services = [BlogsRepository, BlogsQueryRepository];
const CommandHandlers = [
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  CreateBlogPostHandler,
];
const QueryHandlers = [GetBlogPostsHandler];

@Module({
  imports: [
    MongooseModule.forFeature([BlogModel]),
    forwardRef(() => PostsModule),
    CqrsModule,
    LikesModule,
  ],
  controllers: [BlogsController],
  providers: [...Services, ...CommandHandlers, ...QueryHandlers],
  exports: [MongooseModule.forFeature([BlogModel]), BlogsQueryRepository],
})
export class BlogsModule {}

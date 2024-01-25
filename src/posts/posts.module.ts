import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../auth/strategies';
import { BlogsModule } from '../blogs/blogs.module';
import { CommentsModule } from '../comments/comments.module';
import { ExpiredTokensModule } from '../expired-tokens/expired-tokens.module';
import { LikesModule } from '../likes/likes.module';
import {
  CreatePostCommentHandler,
  CreatePostHandler,
  DeletePostHandler,
  UpdatePostHandler,
} from './commands';
import { IsBlogExistsConstraint } from './decorators/is-blog-exists.decorator';
import { Post, PostSchema } from './post.schema';
import { PostsController } from './posts.controller';
import { PostsQueryRepository } from './posts.query-repository';
import { PostsRepository } from './posts.repository';
import {
  GetPostCommentsHandler,
  GetPostHandler,
  GetPostsHandler,
} from './queries';

const PostModel = { name: Post.name, schema: PostSchema };
const Services = [
  PostsRepository,
  PostsQueryRepository,
  JwtStrategy,
  JwtService,
];
const CommandHandlers = [
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  CreatePostCommentHandler,
];
const QueryHandlers = [GetPostHandler, GetPostsHandler, GetPostCommentsHandler];

@Module({
  imports: [
    MongooseModule.forFeature([PostModel]),
    forwardRef(() => BlogsModule),
    CommentsModule,
    LikesModule,
    ExpiredTokensModule,
    CqrsModule,
  ],
  controllers: [PostsController],
  providers: [
    ...Services,
    ...CommandHandlers,
    ...QueryHandlers,
    IsBlogExistsConstraint,
  ],
  exports: [MongooseModule.forFeature([PostModel]), PostsRepository],
})
export class PostsModule {}

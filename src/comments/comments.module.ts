import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesModule } from '../likes/likes.module';
import { DeleteCommentHandler, UpdateCommentHandler } from './commands';
import { Comment, CommentSchema } from './comment.schema';
import { CommentsController } from './comments.controller';
import { CommentsQueryRepository } from './comments.query-repository';
import { CommentsRepository } from './comments.repository';
import { GetCommentHandler } from './queries';

const CommentModel = { name: Comment.name, schema: CommentSchema };
const Services = [CommentsRepository, CommentsQueryRepository];
const CommandHandlers = [UpdateCommentHandler, DeleteCommentHandler];
const QueryHandlers = [GetCommentHandler];

@Module({
  imports: [MongooseModule.forFeature([CommentModel]), LikesModule, CqrsModule],
  controllers: [CommentsController],
  providers: [...Services, ...CommandHandlers, ...QueryHandlers],
  exports: [MongooseModule.forFeature([CommentModel]), CommentsRepository],
})
export class CommentsModule {}

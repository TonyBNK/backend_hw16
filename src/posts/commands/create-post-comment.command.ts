import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentDocument,
  CommentModelType,
} from '../../comments/comment.schema';
import { CommentsRepository } from '../../comments/comments.repository';
import { CreateCommentDto } from '../../comments/dto';
import { PostsQueryRepository } from '../posts.query-repository';

export class CreatePostCommentCommand {
  constructor(public readonly commentDto: CreateCommentDto) {}
}

@CommandHandler(CreatePostCommentCommand)
export class CreatePostCommentHandler
  implements ICommandHandler<CreatePostCommentCommand>
{
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    @InjectModel('Comment') private CommentModel: CommentModelType,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute({
    commentDto,
  }: CreatePostCommentCommand): Promise<CommentDocument | null> {
    const comment = await this.CommentModel.createInstance(
      this.CommentModel,
      commentDto,
      this.postsQueryRepository,
    );

    return this.commentsRepository.save(comment);
  }
}

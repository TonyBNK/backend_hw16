import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../comments.query-repository';

export class DeleteCommentCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute({ id }: DeleteCommentCommand): Promise<boolean> {
    const comment = await this.commentsQueryRepository.getCommentById(id);

    if (!comment) {
      return false;
    }

    const result = await comment.deleteOne();

    return result.acknowledged && !!result.deletedCount;
  }
}

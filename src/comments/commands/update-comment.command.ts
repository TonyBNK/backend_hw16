import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../comments.query-repository';
import { CommentsRepository } from '../comments.repository';
import { UpdateCommentDto } from '../dto';

export class UpdateCommentCommand {
  constructor(
    public readonly id: string,
    public readonly commentDto: UpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute({ id, commentDto }: UpdateCommentCommand): Promise<boolean> {
    const comment = await this.commentsQueryRepository.getCommentById(id);

    if (!comment) {
      return false;
    }

    Object.keys(commentDto).forEach((key) => {
      comment[key] = commentDto[key];
    });

    const result = await this.commentsRepository.save(comment);

    return Boolean(result);
  }
}

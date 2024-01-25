import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../constants';
import { UpdateLikeDto } from '../dto';
import { DislikeCommand } from './dislike.command';
import { LikeCommand } from './like.command';
import { UnlikeCommand } from './unlike.command';

export class UpdateLikeStatusCommand {
  constructor(public readonly likeDto: UpdateLikeDto) {}
}

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusHandler
  implements ICommandHandler<UpdateLikeStatusCommand>
{
  constructor(private commandBus: CommandBus) {}

  async execute({ likeDto }: UpdateLikeStatusCommand) {
    switch (likeDto.likeStatus) {
      case LikeStatus.Like:
        return this.commandBus.execute(new LikeCommand(likeDto));
      case LikeStatus.Dislike:
        return this.commandBus.execute(new DislikeCommand(likeDto));
      case LikeStatus.None:
        return this.commandBus.execute(new UnlikeCommand(likeDto));
      default:
        throw new Error('Such like status does not exist.');
    }
  }
}

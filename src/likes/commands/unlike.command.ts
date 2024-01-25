import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateLikeDto } from '../dto';
import { LikeModelType } from '../like.schema';
import { LikesQueryRepository } from '../likes.query-repository';
import { LikesRepository } from '../likes.repository';

export class UnlikeCommand {
  constructor(public readonly likeDto: UpdateLikeDto) {}
}

@CommandHandler(UnlikeCommand)
export class UnlikeHandler implements ICommandHandler<UnlikeCommand> {
  constructor(
    @InjectModel('Like') private LikeModel: LikeModelType,
    private likesRepository: LikesRepository,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({
    likeDto: { entityId, entityType, userId },
  }: UnlikeCommand): Promise<boolean> {
    const like = await this.likesQueryRepository.getLikeByEntity(
      entityId,
      entityType,
      userId,
    );

    if (!like) {
      return true;
    }

    const result = await like.deleteOne();

    return result.acknowledged && !!result.deletedCount;
  }
}

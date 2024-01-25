import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { LikeStatus } from '../../constants';
import { UpdateLikeDto } from '../dto';
import { LikeModelType } from '../like.schema';
import { LikesQueryRepository } from '../likes.query-repository';
import { LikesRepository } from '../likes.repository';

export class DislikeCommand {
  constructor(public readonly likeDto: UpdateLikeDto) {}
}

@CommandHandler(DislikeCommand)
export class DislikeHandler implements ICommandHandler<DislikeCommand> {
  constructor(
    @InjectModel('Like') private LikeModel: LikeModelType,
    private likesRepository: LikesRepository,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({
    likeDto: { entityId, entityType, userId, login },
  }: DislikeCommand): Promise<boolean> {
    const like = await this.likesQueryRepository.getLikeByEntity(
      entityId,
      entityType,
      userId,
    );

    if (!like) {
      const like = this.LikeModel.createInstance(this.LikeModel, {
        entityId,
        entityType,
        likeStatus: LikeStatus.Dislike,
        userId,
        login,
      });

      await this.likesRepository.save(like);

      return true;
    }

    if (like.likeStatus === LikeStatus.Dislike) {
      return true;
    }

    like.likeStatus = LikeStatus.Dislike;

    const result = await this.likesRepository.save(like);

    return Boolean(result);
  }
}

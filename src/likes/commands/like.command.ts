import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { LikeStatus } from '../../constants';
import { UpdateLikeDto } from '../dto';
import { LikeModelType } from '../like.schema';
import { LikesQueryRepository } from '../likes.query-repository';
import { LikesRepository } from '../likes.repository';

export class LikeCommand {
  constructor(public readonly likeDto: UpdateLikeDto) {}
}

@CommandHandler(LikeCommand)
export class LikeHandler implements ICommandHandler<LikeCommand> {
  constructor(
    @InjectModel('Like') private LikeModel: LikeModelType,
    private likesRepository: LikesRepository,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({
    likeDto: { entityId, entityType, userId, login },
  }: LikeCommand): Promise<boolean> {
    const like = await this.likesQueryRepository.getLikeByEntity(
      entityId,
      entityType,
      userId,
    );

    if (!like) {
      const like = this.LikeModel.createInstance(this.LikeModel, {
        entityId,
        entityType,
        likeStatus: LikeStatus.Like,
        userId,
        login,
      });

      await this.likesRepository.save(like);

      return true;
    }

    if (like.likeStatus === LikeStatus.Like) {
      return true;
    }

    like.likeStatus = LikeStatus.Like;

    const result = await this.likesRepository.save(like);

    return Boolean(result);
  }
}

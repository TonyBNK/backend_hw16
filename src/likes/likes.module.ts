import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DislikeHandler,
  LikeHandler,
  UnlikeHandler,
  UpdateLikeStatusHandler,
} from './commands';
import { Like, LikeSchema } from './like.schema';
import { LikesQueryRepository } from './likes.query-repository';
import { LikesRepository } from './likes.repository';

const LikeModel = { name: Like.name, schema: LikeSchema };
const Services = [LikesRepository, LikesQueryRepository];
const CommandHandlers = [
  UpdateLikeStatusHandler,
  LikeHandler,
  DislikeHandler,
  UnlikeHandler,
];

@Module({
  imports: [MongooseModule.forFeature([LikeModel]), CqrsModule],
  providers: [...Services, ...CommandHandlers],
  exports: [MongooseModule.forFeature([LikeModel]), ...Services],
})
export class LikesModule {}

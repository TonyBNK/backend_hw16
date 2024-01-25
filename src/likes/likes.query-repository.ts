import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeStatus, LikeableEntity } from '../constants';
import { LikeDetails } from '../types';
import { Like, LikeDocument } from './like.schema';

@Injectable()
export class LikesQueryRepository {
  constructor(@InjectModel('Like') private LikeModel: Model<Like>) {}

  async getLikeByEntity(
    id: string,
    type: LikeableEntity,
    userId: string,
  ): Promise<LikeDocument | null> {
    return this.LikeModel.findOne({ entityId: id, entityType: type, userId });
  }

  async getLikesCount({
    likeStatus,
    entityType,
  }: {
    likeStatus: LikeStatus;
    entityType: LikeableEntity;
  }): Promise<Record<string, number>> {
    const result = await this.LikeModel.aggregate([
      {
        $match: {
          likeStatus,
          entityType,
        },
      },
      { $group: { _id: '$entityId', count: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          entityId: '$_id',
          count: 1,
        },
      },
    ]); // [ { entityId: '658dc5d44900cf2de93ba71a', count: 1 } ]

    return result.reduce((acc, next) => {
      acc[next.entityId] = next.count;
      return acc;
    }, {});
  }

  async getUserLikeStatus({
    userId,
    entityType,
  }: {
    userId: string;
    entityType: LikeableEntity;
  }): Promise<Record<string, LikeStatus>> {
    const result = await this.LikeModel.aggregate([
      {
        $match: {
          userId,
          entityType,
        },
      },
      {
        $project: {
          _id: 0,
          entityId: '$entityId',
          myStatus: '$likeStatus',
        },
      },
    ]); // [ { entityId: '658dc5d44900cf2de93ba71a', myStatus: 'Like' } ]

    return result.reduce((acc, next) => {
      acc[next.entityId] = next.myStatus;
      return acc;
    }, {});
  }

  async getNewestLikes(
    newestLikesCount: number = 3,
  ): Promise<Record<string, Array<LikeDetails>>> {
    const result = await this.LikeModel.aggregate([
      {
        $match: {
          likeStatus: LikeStatus.Like,
        },
      },
      {
        $sort: { addedAt: -1 },
      },
      {
        $group: {
          _id: '$entityId',
          entities: {
            $push: {
              userId: '$userId',
              addedAt: '$addedAt',
              login: '$login',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          entityId: '$_id',
          entities: { $slice: ['$entities', newestLikesCount] },
        },
      },
    ]); // [ { entityId: '658dc5d44900cf2de93ba71a', entities: [ [Object] ] } ]

    return result.reduce((acc, next) => {
      acc[next.entityId] = next.entities;
      return acc;
    }, {});
  }
}

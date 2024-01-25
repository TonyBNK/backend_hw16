import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model } from 'mongoose';
import { LikeStatus, LikeableEntity } from '../constants';
import { CreateLikeDto } from './dto';

export type LikeDocument = HydratedDocument<Like>;

type LikeStaticType = {
  createInstance: (
    LikeModel: Model<LikeDocument>,
    likeDto: CreateLikeDto,
  ) => LikeDocument;
};

export type LikeModelType = Model<LikeDocument> & LikeStaticType;

@Schema()
export class Like extends Document {
  @Prop({ required: true }) entityId: string;

  @Prop({ required: true }) entityType: LikeableEntity;

  @Prop({ required: true }) userId: string;

  @Prop({ required: true }) login: string;

  @Prop({ required: true }) addedAt: string;

  @Prop({ required: true }) likeStatus: LikeStatus;

  static createInstance(
    LikeModel: Model<LikeDocument>,
    { entityId, entityType, likeStatus, userId, login }: CreateLikeDto,
  ): LikeDocument {
    return new LikeModel({
      entityId,
      entityType,
      likeStatus,
      userId,
      login,
      addedAt: new Date().toISOString(),
    });
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.statics = {
  createInstance: Like.createInstance,
};

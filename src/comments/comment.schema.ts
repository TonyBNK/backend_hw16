import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model } from 'mongoose';
import { LikeStatus } from '../constants';
import { PostsQueryRepository } from '../posts/posts.query-repository';
import { CommentatorInfo, LikesInfo } from '../types';
import { CreateCommentDto } from './dto';

export type CommentDocument = HydratedDocument<Comment>;

type CommentStaticType = {
  createInstance: (
    CommentModel: Model<CommentDocument>,
    commentDto: CreateCommentDto,
    postsQueryRepository: PostsQueryRepository,
  ) => Promise<CommentDocument>;
};

export type CommentModelType = Model<CommentDocument> & CommentStaticType;

@Schema()
export class Comment extends Document {
  @Prop({ required: true }) postId: string;

  @Prop({ required: true }) content: string;

  @Prop(
    raw({
      userId: { type: String },
      userLogin: { type: String },
    }),
  )
  commentatorInfo: CommentatorInfo;

  @Prop() createdAt: string;

  @Prop(
    raw({
      likesCount: { type: Number, default: 0 },
      dislikesCount: { type: Number, default: 0 },
      myStatus: {
        type: String,
        of: Object.values(LikeStatus),
        default: LikeStatus.None,
      },
    }),
  )
  likesInfo: LikesInfo;

  static async createInstance(
    CommentModel: Model<CommentDocument>,
    { postId, content, userId, userLogin }: CreateCommentDto,
    postsQueryRepository: PostsQueryRepository,
  ): Promise<CommentDocument | null> {
    const post = await postsQueryRepository.getPostById(postId);

    if (!post) {
      return null;
    }

    return new CommentModel({
      postId,
      content,
      commentatorInfo: {
        userId,
        userLogin,
      },
      createdAt: new Date().toISOString(),
    });
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.statics = {
  createInstance: Comment.createInstance,
};

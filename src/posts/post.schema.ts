import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model } from 'mongoose';
import { BlogsQueryRepository } from '../blogs/blogs.query-repository';
import { CommentDocument } from '../comments/comment.schema';
import { GetCommentsDto } from '../comments/dto';
import { LikeStatus } from '../constants';
import { LikeSchema } from '../likes/like.schema';
import { ExtendedLikesInfo, Paginator } from '../types';
import { CreatePostCommentCommand } from './commands';
import { CreatePostCommentDto, CreatePostDto } from './dto';
import { GetPostCommentsQuery } from './queries/get-post-comments.query';

export type PostDocument = HydratedDocument<Post>;

type PostStaticType = {
  createInstance: (
    PostModel: Model<PostDocument>,
    postDto: CreatePostDto,
    blogsQueryRepository: BlogsQueryRepository,
  ) => Promise<PostDocument>;
};

export type PostModelType = Model<PostDocument> & PostStaticType;

@Schema()
export class Post extends Document {
  @Prop({ required: true }) title: string;

  @Prop({ required: true }) shortDescription: string;

  @Prop({ required: true }) content: string;

  @Prop({ required: true }) blogId: string;

  @Prop() blogName: string;

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
      newestLikes: [LikeSchema],
    }),
  )
  extendedLikesInfo: ExtendedLikesInfo;

  static async createInstance(
    PostModel: Model<PostDocument>,
    { title, shortDescription, content, blogId }: CreatePostDto,
    blogsQueryRepository: BlogsQueryRepository,
  ): Promise<PostDocument | null> {
    const blog = await blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      return null;
    }

    return new PostModel({
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    });
  }

  async getComments(
    queryBus: QueryBus,
    queryParams?: GetCommentsDto,
    userId?: string,
  ): Promise<Paginator<CommentDocument>> {
    return queryBus.execute(
      new GetPostCommentsQuery(this.id, queryParams, userId),
    );
  }

  async createComment(
    commandBus: CommandBus,
    postCommentDto: CreatePostCommentDto,
  ) {
    return commandBus.execute(
      new CreatePostCommentCommand({
        postId: this.id,
        content: postCommentDto.content,
        userId: postCommentDto.userId,
        userLogin: postCommentDto.userLogin,
      }),
    );
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.statics = {
  createInstance: Post.createInstance,
};

PostSchema.methods = {
  getComments: Post.prototype.getComments,
  createComment: Post.prototype.createComment,
};

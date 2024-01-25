import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model } from 'mongoose';
import { GetPostsDto } from '../posts/dto';
import { PostDocument } from '../posts/post.schema';
import { Paginator } from '../types';
import { CreateBlogPostCommand } from './commands';
import { CreateBlogDto, CreateBlogPostDto } from './dto';
import { GetBlogPostsQuery } from './queries';

export type BlogDocument = HydratedDocument<Blog>;

type BlogStaticType = {
  createInstance: (
    BlogModel: Model<BlogDocument>,
    blogDto: CreateBlogDto,
  ) => BlogDocument;
};

export type BlogModelType = Model<BlogDocument> & BlogStaticType;

@Schema()
export class Blog extends Document {
  @Prop({ required: true }) name: string;

  @Prop({ required: true }) description: string;

  @Prop({ required: true }) websiteUrl: string;

  @Prop() createdAt: string;

  @Prop() isMembership: boolean;

  static createInstance(
    BlogModel: Model<BlogDocument>,
    { name, description, websiteUrl }: CreateBlogDto,
  ): BlogDocument {
    return new BlogModel({
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });
  }

  async getPosts(
    queryBus: QueryBus,
    queryParams?: GetPostsDto,
    userId?: string,
  ): Promise<Paginator<PostDocument>> {
    return queryBus.execute(
      new GetBlogPostsQuery(this.id, queryParams, userId),
    );
  }

  async createPost(commandBus: CommandBus, blogPostDto: CreateBlogPostDto) {
    return commandBus.execute(new CreateBlogPostCommand(this.id, blogPostDto));
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.statics = {
  createInstance: Blog.createInstance,
};

BlogSchema.methods = {
  getPosts: Blog.prototype.getPosts,
  createPost: Blog.prototype.createPost,
};

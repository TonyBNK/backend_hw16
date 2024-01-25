import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../comments/comment.schema';
import { GetCommentsDto } from '../comments/dto';
import { Paginator } from '../types';
import { GetPostsDto } from './dto';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel('Post') private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async getPosts(queryParams?: GetPostsDto): Promise<Paginator<PostDocument>> {
    const sortBy = queryParams?.sortBy ?? 'createdAt';
    const sortDirection = queryParams?.sortDirection ?? 'desc';
    const pageNumber = Number(queryParams?.pageNumber) || 1;
    const pageSize = Number(queryParams?.pageSize) || 10;

    const posts = await this.postModel
      .find()
      .sort({
        [sortBy]: sortDirection,
      })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await this.postModel.countDocuments();
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      totalCount,
      pagesCount,
      page: pageNumber,
      pageSize,
      items: posts,
    };
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    return this.postModel.findById(id);
  }

  async getPostComments(
    postId: string,
    queryParams?: GetCommentsDto,
  ): Promise<Paginator<CommentDocument>> {
    const sortBy = queryParams?.sortBy ?? 'createdAt';
    const sortDirection = queryParams?.sortDirection ?? 'desc';
    const pageNumber = Number(queryParams?.pageNumber) || 1;
    const pageSize = Number(queryParams?.pageSize) || 10;

    const comments = await this.commentModel
      .find({ postId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await this.commentModel.countDocuments({ postId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: comments,
    };
  }
}

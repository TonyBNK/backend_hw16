import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { GetPostsDto } from '../posts/dto';
import { Post, PostDocument } from '../posts/post.schema';
import { Paginator } from '../types';
import { Blog, BlogDocument } from './blog.schema';
import { GetBlogsDto } from './dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel('Blog') private blogModel: Model<Blog>,
    @InjectModel('Post') private postModel: Model<Post>,
  ) {}

  async getBlogs(queryParams?: GetBlogsDto): Promise<Paginator<BlogDocument>> {
    const filter: FilterQuery<Blog> = {};

    const searchNameTerm = queryParams?.searchNameTerm ?? null;
    const sortBy = queryParams?.sortBy ?? 'createdAt';
    const sortDirection = queryParams?.sortDirection ?? 'desc';
    const pageNumber = Number(queryParams?.pageNumber) || 1;
    const pageSize = Number(queryParams?.pageSize) || 10;

    if (searchNameTerm) {
      filter.name = {
        $regex: searchNameTerm,
        $options: 'i',
      };
    }

    const blogs = await this.blogModel
      .find(filter)
      .sort({
        [sortBy]: sortDirection,
      })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await this.blogModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      totalCount,
      pagesCount,
      page: pageNumber,
      pageSize,
      items: blogs,
    };
  }

  async getBlogById(id: string): Promise<BlogDocument | null> {
    return this.blogModel.findById(id);
  }

  async getBlogPosts(
    blogId: string,
    queryParams?: GetPostsDto,
  ): Promise<Paginator<PostDocument>> {
    const sortBy = queryParams?.sortBy ?? 'createdAt';
    const sortDirection = queryParams?.sortDirection ?? 'desc';
    const pageNumber = Number(queryParams?.pageNumber) || 1;
    const pageSize = Number(queryParams?.pageSize) || 10;

    const posts = await this.postModel
      .find({ blogId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await this.postModel.countDocuments({
      blogId,
    });
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts,
    };
  }
}

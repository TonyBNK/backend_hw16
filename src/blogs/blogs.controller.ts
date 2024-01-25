import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../auth/decorators';
import { BasicAuthGuard, SoftJwtAuthGuard } from '../auth/guards';
import { GetPostsDto } from '../posts/dto';
import { BlogViewModel, Paginator, PostViewModel } from '../types';
import {
  mapBlogToViewModel,
  mapPaginatorToViewModel,
  mapPostToViewModel,
} from '../utils';
import { Blog } from './blog.schema';
import { BlogsQueryRepository } from './blogs.query-repository';
import {
  CreateBlogCommand,
  DeleteBlogCommand,
  UpdateBlogCommand,
} from './commands';
import {
  CreateBlogDto,
  CreateBlogPostDto,
  GetBlogsDto,
  UpdateBlogDto,
} from './dto';
import { BlogExistsGuard } from './guards';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  async createBlog(@Body() body: CreateBlogDto): Promise<BlogViewModel> {
    const blog = await this.commandBus.execute(new CreateBlogCommand(body));

    return mapBlogToViewModel(blog);
  }

  @Get()
  async getBlogs(
    @Query() query?: GetBlogsDto,
  ): Promise<Paginator<BlogViewModel>> {
    const blogs = await this.blogsQueryRepository.getBlogs(query);

    return mapPaginatorToViewModel<Blog, BlogViewModel>(mapBlogToViewModel)(
      blogs,
    );
  }

  @Get(':id')
  async getBlog(@Param('id') id: string): Promise<BlogViewModel> {
    const blog = await this.blogsQueryRepository.getBlogById(id);

    if (!blog) {
      throw new NotFoundException('Such blog does not exist!');
    }

    return mapBlogToViewModel(blog);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BasicAuthGuard, BlogExistsGuard)
  async updateBlog(@Param('id') id: string, @Body() body: UpdateBlogDto) {
    await this.commandBus.execute(new UpdateBlogCommand(id, body));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BasicAuthGuard, BlogExistsGuard)
  async deleteBlog(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteBlogCommand(id));
  }

  @Get(':blogId/posts')
  @UseGuards(SoftJwtAuthGuard, BlogExistsGuard)
  async getBlogPosts(
    @Param('blogId') blogId: string,
    @Query() query?: GetPostsDto,
    @User('id') userId?: string,
  ): Promise<Paginator<PostViewModel>> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    const posts = await blog!.getPosts(this.queryBus, query, userId);

    return mapPaginatorToViewModel(mapPostToViewModel)(posts);
  }

  @Post(':blogId/posts')
  @UseGuards(BasicAuthGuard, BlogExistsGuard)
  async createBlogPost(
    @Param('blogId') blogId: string,
    @Body() body: CreateBlogPostDto,
  ): Promise<PostViewModel> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    const post = await blog!.createPost(this.commandBus, body);

    if (!post) {
      throw new BadRequestException('Bad data!');
    }

    return mapPostToViewModel(post);
  }
}

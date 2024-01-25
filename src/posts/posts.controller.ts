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
import {
  AccessTokenGuard,
  BasicAuthGuard,
  SoftJwtAuthGuard,
} from '../auth/guards';
import { GetCommentsDto } from '../comments/dto';
import { LikeableEntity } from '../constants';
import { UpdateLikeStatusCommand } from '../likes/commands';
import { CreateLikeInputDto } from '../likes/dto';
import { CommentViewModel, Paginator, PostViewModel } from '../types';
import {
  mapCommentToViewModel,
  mapPaginatorToViewModel,
  mapPostToViewModel,
} from '../utils';
import {
  CreatePostCommand,
  DeletePostCommand,
  UpdatePostCommand,
} from './commands';
import { CreatePostCommentInputDto, GetPostsDto } from './dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsGuard } from './guards';
import { GetPostQuery, GetPostsQuery } from './queries';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() body: CreatePostDto): Promise<PostViewModel> {
    const post = await this.commandBus.execute(new CreatePostCommand(body));

    return mapPostToViewModel(post);
  }

  @Get()
  @UseGuards(SoftJwtAuthGuard)
  async getPosts(
    @Query() query?: GetPostsDto,
    @User('id') userId?: string,
  ): Promise<Paginator<PostViewModel>> {
    const posts = await this.queryBus.execute(new GetPostsQuery(query, userId));

    return mapPaginatorToViewModel(mapPostToViewModel)(posts);
  }

  @Get(':id')
  @UseGuards(SoftJwtAuthGuard)
  async getPost(
    @Param('id') id: string,
    @User('id') userId?: string,
  ): Promise<PostViewModel> {
    const post = await this.queryBus.execute(new GetPostQuery(id, userId));

    if (!post) {
      throw new NotFoundException('Such post does not exist!');
    }

    return mapPostToViewModel(post);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BasicAuthGuard, PostExistsGuard)
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostDto) {
    await this.commandBus.execute(new UpdatePostCommand(id, body));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BasicAuthGuard, PostExistsGuard)
  async deletePost(@Param('id') id: string) {
    await this.commandBus.execute(new DeletePostCommand(id));
  }

  @Get(':postId/comments')
  @UseGuards(SoftJwtAuthGuard, PostExistsGuard)
  async getPostComments(
    @Param('postId') postId: string,
    @Query() query?: GetCommentsDto,
    @User('id') userId?: string,
  ): Promise<Paginator<CommentViewModel>> {
    const post = await this.queryBus.execute(new GetPostQuery(postId, userId));

    const comments = await post!.getComments(this.queryBus, query, userId);

    return mapPaginatorToViewModel(mapCommentToViewModel)(comments);
  }

  @Post(':postId/comments')
  @UseGuards(AccessTokenGuard, PostExistsGuard)
  async createPostComment(
    @Param('postId') postId: string,
    @Body() body: CreatePostCommentInputDto,
    @User('id') userId: string,
    @User('login') userLogin: string,
  ): Promise<CommentViewModel> {
    const post = await this.queryBus.execute(new GetPostQuery(postId));

    const comment = await post!.createComment(this.commandBus, {
      content: body.content,
      userId,
      userLogin,
    });

    if (!comment) {
      throw new BadRequestException('Bad data!');
    }

    return mapCommentToViewModel(comment);
  }

  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard, PostExistsGuard)
  async likePost(
    @Param('postId') postId: string,
    @Body() body: CreateLikeInputDto,
    @User('id') userId: string,
    @User('login') userLogin: string,
  ) {
    await this.commandBus.execute(
      new UpdateLikeStatusCommand({
        likeStatus: body.likeStatus,
        entityId: postId,
        entityType: LikeableEntity.Post,
        userId,
        login: userLogin,
      }),
    );
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../auth/decorators';
import { AccessTokenGuard, SoftJwtAuthGuard } from '../auth/guards';
import { LikeableEntity } from '../constants';
import { UpdateLikeStatusCommand } from '../likes/commands';
import { CreateLikeInputDto } from '../likes/dto';
import { mapCommentToViewModel } from '../utils';
import { DeleteCommentCommand, UpdateCommentCommand } from './commands';
import { UpdateCommentInputDto } from './dto';
import { CommentExistsGuard, OwnCommentGuard } from './guards';
import { GetCommentQuery } from './queries';

@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':id')
  @UseGuards(SoftJwtAuthGuard)
  async getComment(@Param('id') id: string, @User('id') userId?: string) {
    const comment = await this.queryBus.execute(
      new GetCommentQuery(id, userId),
    );

    if (!comment) {
      throw new NotFoundException('Such comment does not exist!');
    }

    return mapCommentToViewModel(comment);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard, CommentExistsGuard, OwnCommentGuard)
  async updateComment(
    @Param('id') id: string,
    @Body() body: UpdateCommentInputDto,
    @User('id') userId: string,
    @User('login') userLogin: string,
  ) {
    await this.commandBus.execute(
      new UpdateCommentCommand(id, {
        content: body.content,
        userId,
        userLogin,
      }),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard, CommentExistsGuard, OwnCommentGuard)
  async deletePost(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteCommentCommand(id));
  }

  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard, CommentExistsGuard)
  async likePost(
    @Param('commentId') commentId: string,
    @Body() body: CreateLikeInputDto,
    @User('id') userId: string,
    @User('login') userLogin: string,
  ) {
    await this.commandBus.execute(
      new UpdateLikeStatusCommand({
        likeStatus: body.likeStatus,
        entityId: commentId,
        entityType: LikeableEntity.Comment,
        userId,
        login: userLogin,
      }),
    );
  }
}

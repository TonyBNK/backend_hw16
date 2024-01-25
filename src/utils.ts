import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { Blog } from './blogs/blog.schema';
import { Comment } from './comments/comment.schema';
import { HttpExceptionFilter } from './exception-filters';
import { Post } from './posts/post.schema';
import { SecurityDevice } from './security-devices/security-device.schema';
import {
  BlogViewModel,
  CommentViewModel,
  ErrorResult,
  LikeDetails,
  MeViewModel,
  Paginator,
  PostViewModel,
  SecurityDeviceViewModel,
  UserViewModel,
} from './types';
import { User } from './users/user.schema';

const validationExceptionFactory = (errors: Array<ValidationError>): never => {
  const errorResult: ErrorResult = {
    errorsMessages: errors.map(({ property, constraints }) => ({
      field: property,
      message: constraints ? Object.values(constraints)[0] : null,
    })),
  };

  throw new BadRequestException(errorResult);
};

export const appSettings = (app: INestApplication) => {
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
};

export const mapBlogToViewModel = (blog: Blog): BlogViewModel => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
  isMembership: blog.isMembership,
});

export const mapPostToViewModel = (post: Post): PostViewModel => ({
  id: post._id.toString(),
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
  extendedLikesInfo: {
    likesCount: post.extendedLikesInfo.likesCount,
    dislikesCount: post.extendedLikesInfo.dislikesCount,
    myStatus: post.extendedLikesInfo.myStatus,
    newestLikes: post.extendedLikesInfo.newestLikes.map(
      mapNewestLikeToViewModel,
    ),
  },
});

export const mapCommentToViewModel = (comment: Comment): CommentViewModel => ({
  id: comment._id.toString(),
  commentatorInfo: comment.commentatorInfo,
  content: comment.content,
  createdAt: comment.createdAt,
  likesInfo: comment.likesInfo,
});

export const mapUserToViewModel = (user: User): UserViewModel => ({
  id: user._id.toString(),
  login: user.accountData.login,
  email: user.email,
  createdAt: user.accountData.createdAt,
});

export const mapSecurityDeviceToViewModel = (
  securityDevice: SecurityDevice,
): SecurityDeviceViewModel => ({
  ip: securityDevice.ip,
  title: securityDevice.title,
  deviceId: securityDevice._id.toString(),
  lastActiveDate: securityDevice.issueDate,
});

export const mapMeToViewModel = (user: User): MeViewModel => ({
  userId: user._id.toString(),
  login: user.accountData.login,
  email: user.email,
});

export const mapPaginatorToViewModel =
  <I, O>(mapper: (item: I) => O) =>
  ({
    totalCount,
    pagesCount,
    page,
    pageSize,
    items,
  }: Paginator<I>): Paginator<O> => ({
    totalCount,
    pagesCount,
    page,
    pageSize,
    items: items.map(mapper),
  });

const mapNewestLikeToViewModel = ({ addedAt, login, userId }: LikeDetails) => ({
  addedAt,
  login,
  userId,
});

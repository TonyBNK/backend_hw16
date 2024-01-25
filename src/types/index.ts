import { LikeStatus } from '../constants';

export { BlogViewModel } from './view/blog';
export { CommentViewModel } from './view/comment';
export { MeViewModel } from './view/me';
export { PostViewModel } from './view/post';
export { SecurityDeviceViewModel } from './view/security-device';
export { UserViewModel } from './view/user';

export type FieldError = {
  message: string | null;
  field: string | null;
};

export type ErrorResult = {
  errorsMessages: Array<FieldError> | null;
};

export type Paginator<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<T>;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type LikeDetails = {
  addedAt: string;
  userId: string | null;
  login: string | null;
};

export type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export type ExtendedLikesInfo = LikesInfo & {
  newestLikes: Array<LikeDetails>;
};

export type AccountData = {
  login: string;
  password: string;
  createdAt: string;
};

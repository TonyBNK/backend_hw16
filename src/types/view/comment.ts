import { CommentatorInfo, LikesInfo } from '..';

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfo;
};

export const commentViewModelKeys: Array<keyof CommentViewModel> = [
  'id',
  'content',
  'commentatorInfo',
  'createdAt',
  'likesInfo',
];

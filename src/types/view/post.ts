import { ExtendedLikesInfo } from '..';

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
};

export const postViewModelKeys: Array<keyof PostViewModel> = [
  'id',
  'title',
  'shortDescription',
  'content',
  'blogId',
  'blogName',
  'blogName',
  'createdAt',
  'extendedLikesInfo',
];

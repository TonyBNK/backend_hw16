export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export const blogViewModelKeys: Array<keyof BlogViewModel> = [
  'id',
  'name',
  'description',
  'websiteUrl',
  'createdAt',
  'isMembership',
];

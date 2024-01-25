export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export const userViewModelKeys: Array<keyof UserViewModel> = [
  'id',
  'login',
  'email',
  'createdAt',
];

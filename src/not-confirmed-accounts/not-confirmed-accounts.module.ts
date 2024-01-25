import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotConfirmedAccount,
  NotConfirmedAccountSchema,
} from './not-confirmed-account.schema';
import { NotConfirmedAccountsQueryRepository } from './not-confirmed-accounts.query-repository';
import { NotConfirmedAccountsRepository } from './not-confirmed-accounts.repository';

const NotConfirmedAccountModel = {
  name: NotConfirmedAccount.name,
  schema: NotConfirmedAccountSchema,
};
const Services = [
  NotConfirmedAccountsRepository,
  NotConfirmedAccountsQueryRepository,
];

@Module({
  imports: [MongooseModule.forFeature([NotConfirmedAccountModel])],
  providers: [...Services],
  exports: [MongooseModule.forFeature([NotConfirmedAccountModel]), ...Services],
})
export class NotConfirmedAccountsModule {}

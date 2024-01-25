import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Paginator } from '../types';
import { GetUsersDto } from './dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUsers(queryParams?: GetUsersDto): Promise<Paginator<UserDocument>> {
    const filter: FilterQuery<User> = {};

    const searchLoginTerm = queryParams?.searchLoginTerm ?? null;
    const searchEmailTerm = queryParams?.searchEmailTerm ?? null;
    const sortBy = queryParams?.sortBy ?? 'createdAt';
    const sortDirection = queryParams?.sortDirection ?? 'desc';
    const pageNumber = Number(queryParams?.pageNumber) || 1;
    const pageSize = Number(queryParams?.pageSize) || 10;

    if (searchLoginTerm) {
      if (!Array.isArray(filter['$or'])) {
        filter['$or'] = [];
      }

      filter['$or'].push({
        'accountData.login': { $regex: searchLoginTerm, $options: 'i' },
      });
    }

    if (searchEmailTerm) {
      if (!Array.isArray(filter['$or'])) {
        filter['$or'] = [];
      }

      filter['$or'].push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }

    const sortKey = sortBy === 'email' ? sortBy : `accountData.${sortBy}`;

    const users = await this.userModel
      .find(filter)
      .sort({
        [sortKey]: sortDirection,
      })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await this.userModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      totalCount,
      pagesCount,
      page: pageNumber,
      pageSize,
      items: users,
    };
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async getUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [{ 'accountData.login': loginOrEmail }, { email: loginOrEmail }],
    });
  }
}

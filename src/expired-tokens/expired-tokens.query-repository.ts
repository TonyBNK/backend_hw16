import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpiredToken, ExpiredTokenDocument } from './expired-token.schema';

@Injectable()
export class ExpiredTokensQueryRepository {
  constructor(
    @InjectModel('ExpiredToken') private expiredTokenModel: Model<ExpiredToken>,
  ) {}

  async getExpiredToken(token: string): Promise<ExpiredTokenDocument | null> {
    return this.expiredTokenModel.findOne({ token });
  }
}

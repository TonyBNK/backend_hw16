import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './blogs/blog.schema';
import { Comment } from './comments/comment.schema';
import { ExpiredToken } from './expired-tokens/expired-token.schema';
import { Like } from './likes/like.schema';
import { NotConfirmedAccount } from './not-confirmed-accounts/not-confirmed-account.schema';
import { NotRecoveredPassword } from './not-recovered-passwords/not-recovered-password.schema';
import { Post } from './posts/post.schema';
import { SecurityDevice } from './security-devices/security-device.schema';
import { User } from './users/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(NotConfirmedAccount.name)
    private notConfirmedAccountModel: Model<NotConfirmedAccount>,
    @InjectModel(NotRecoveredPassword.name)
    private notRecoveredPasswordModel: Model<NotRecoveredPassword>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(SecurityDevice.name)
    private securityDeviceModel: Model<SecurityDevice>,
    @InjectModel(ExpiredToken.name)
    private expiredTokenModel: Model<ExpiredToken>,
  ) {}

  async deleteAllData() {
    await Promise.all([
      this.blogModel.deleteMany(),
      this.postModel.deleteMany(),
      this.commentModel.deleteMany(),
      this.userModel.deleteMany(),
      this.notConfirmedAccountModel.deleteMany(),
      this.notRecoveredPasswordModel.deleteMany(),
      this.likeModel.deleteMany(),
      this.securityDeviceModel.deleteMany(),
      this.expiredTokenModel.deleteMany(),
    ]);
  }
}

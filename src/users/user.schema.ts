import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Document, HydratedDocument, Model } from 'mongoose';
import { AccountData } from '../types';
import { CreateUserDto } from './dto';
import { UsersQueryRepository } from './users.query-repository';
import { UsersRepository } from './users.repository';

export type UserDocument = HydratedDocument<User>;

type UserStaticType = {
  createInstance: (
    UserModel: Model<UserDocument>,
    userDto: CreateUserDto,
  ) => Promise<UserDocument>;
};

export type UserModelType = Model<UserDocument> & UserStaticType;

@Schema()
export class User extends Document {
  @Prop({ required: true }) email: string;

  @Prop(
    raw({
      login: { type: String, required: true },
      password: { type: String, required: true },
      createdAt: { type: String, required: true },
    }),
  )
  accountData: AccountData;

  static async createInstance(
    UserModel: Model<UserDocument>,
    { email, login, password }: CreateUserDto,
  ) {
    const passwordHash = await bcrypt.hash(password, 10);

    return new UserModel({
      email,
      accountData: {
        login,
        password: passwordHash,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async updatePassword(
    usersRepository: UsersRepository,
    usersQueryRepository: UsersQueryRepository,
    newPassword: string,
  ): Promise<UserDocument | null> {
    const user = await usersQueryRepository.getUserByLoginOrEmail(this.email);

    if (!user) {
      return null;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.accountData.password = newPasswordHash;

    return usersRepository.save(user);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics = {
  createInstance: User.createInstance,
};

UserSchema.methods = {
  updatePassword: User.prototype.updatePassword,
};

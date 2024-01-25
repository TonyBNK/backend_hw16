import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from '../auth/strategies';
import { CreateUserHandler, DeleteUserHandler } from './commands';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersQueryRepository } from './users.query-repository';
import { UsersRepository } from './users.repository';

const UserModel = { name: User.name, schema: UserSchema };
const Services = [UsersRepository, UsersQueryRepository, BasicStrategy];
const CommandHandlers = [CreateUserHandler, DeleteUserHandler];

@Module({
  imports: [MongooseModule.forFeature([UserModel]), PassportModule, CqrsModule],
  controllers: [UsersController],
  providers: [...Services, ...CommandHandlers],
  exports: [
    MongooseModule.forFeature([UserModel]),
    UsersRepository,
    UsersQueryRepository,
  ],
})
export class UsersModule {}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto';
import { UserDocument, UserModelType } from '../user.schema';
import { UsersRepository } from '../users.repository';

export class CreateUserCommand {
  constructor(public readonly userDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel('User') private UserModel: UserModelType,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ userDto }: CreateUserCommand): Promise<UserDocument> {
    const user = await this.UserModel.createInstance(this.UserModel, userDto);

    return this.usersRepository.save(user);
  }
}

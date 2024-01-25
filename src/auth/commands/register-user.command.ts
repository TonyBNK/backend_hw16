import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { MailService } from '../../mail/mail.service';
import {
  NotConfirmedAccount,
  NotConfirmedAccountModelType,
} from '../../not-confirmed-accounts/not-confirmed-account.schema';
import { NotConfirmedAccountsRepository } from '../../not-confirmed-accounts/not-confirmed-accounts.repository';
import { CreateUserDto } from '../../users/dto';
import { User, UserModelType } from '../../users/user.schema';
import { UsersRepository } from '../../users/users.repository';

export class RegisterUserCommand {
  constructor(public readonly userDto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,

    @InjectModel(NotConfirmedAccount.name)
    private NotConfirmedAccountModel: NotConfirmedAccountModelType,

    private notConfirmedAccountsRepository: NotConfirmedAccountsRepository,
    private mailService: MailService,
  ) {}

  async execute({ userDto: { email, login, password } }: RegisterUserCommand) {
    const user = await this.UserModel.createInstance(this.UserModel, {
      email,
      login,
      password,
    });

    const notConfirmedAccount = this.NotConfirmedAccountModel.createInstance(
      this.NotConfirmedAccountModel,
      { email },
    );

    await Promise.all([
      this.usersRepository.save(user),
      this.notConfirmedAccountsRepository.save(notConfirmedAccount),
    ]);

    await this.mailService.sendRegistrationConfirmationMessage(
      email,
      notConfirmedAccount.confirmationCode,
    );
  }
}

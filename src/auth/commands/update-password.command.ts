import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotRecoveredPasswordsQueryRepository } from '../../not-recovered-passwords/not-recovered-passwords.query-repository';
import { UsersQueryRepository } from '../../users/users.query-repository';
import { UsersRepository } from '../../users/users.repository';
import { NewPasswordDto } from '../dto';

export class UpdatePasswordCommand {
  constructor(public readonly newPasswordDto: NewPasswordDto) {}
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler
  implements ICommandHandler<UpdatePasswordCommand>
{
  constructor(
    private notRecoveredPasswordsQueryRepository: NotRecoveredPasswordsQueryRepository,
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute({
    newPasswordDto: { newPassword, recoveryCode },
  }: UpdatePasswordCommand) {
    const notRecoveredPassword =
      await this.notRecoveredPasswordsQueryRepository.getNotRecoveredPasswordByCode(
        recoveryCode,
      );

    const user = await this.usersQueryRepository.getUserByLoginOrEmail(
      notRecoveredPassword!.email,
    );

    if (!user) {
      return;
    }

    await user.updatePassword(
      this.usersRepository,
      this.usersQueryRepository,
      newPassword,
    );
  }
}

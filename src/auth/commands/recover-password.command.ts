import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { MailService } from '../../mail/mail.service';
import {
  NotRecoveredPassword,
  NotRecoveredPasswordModelType,
} from '../../not-recovered-passwords/not-recovered-password.schema';
import { NotRecoveredPasswordsRepository } from '../../not-recovered-passwords/not-recovered-passwords.repository';
import { PasswordRecoveryDto } from '../dto';

export class RecoverPasswordCommand {
  constructor(public readonly passwordRecoveryDto: PasswordRecoveryDto) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordHandler
  implements ICommandHandler<RecoverPasswordCommand>
{
  constructor(
    @InjectModel(NotRecoveredPassword.name)
    private NotRecoveredPasswordModel: NotRecoveredPasswordModelType,
    private notRecoveredPasswordsRepository: NotRecoveredPasswordsRepository,
    private mailService: MailService,
  ) {}

  async execute({ passwordRecoveryDto: { email } }: RecoverPasswordCommand) {
    const notRecoveredPassword = this.NotRecoveredPasswordModel.createInstance(
      this.NotRecoveredPasswordModel,
      { email },
    );

    await this.notRecoveredPasswordsRepository.save(notRecoveredPassword);

    await this.mailService.sendPasswordRecoveryMessage(
      email,
      notRecoveredPassword.recoveryCode,
    );
  }
}

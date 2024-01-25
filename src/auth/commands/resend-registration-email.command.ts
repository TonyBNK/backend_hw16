import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../mail/mail.service';
import { NotConfirmedAccountsQueryRepository } from '../../not-confirmed-accounts/not-confirmed-accounts.query-repository';
import { NotConfirmedAccountsRepository } from '../../not-confirmed-accounts/not-confirmed-accounts.repository';
import { ResendRegistrationEmailDto } from '../dto';

export class ResendRegistrationEmailCommand {
  constructor(
    public readonly resendRegistrationEmailDto: ResendRegistrationEmailDto,
  ) {}
}

@CommandHandler(ResendRegistrationEmailCommand)
export class ResendRegistrationEmailHandler
  implements ICommandHandler<ResendRegistrationEmailCommand>
{
  constructor(
    private notConfirmedAccountsRepository: NotConfirmedAccountsRepository,
    private notConfirmedAccountsQueryRepository: NotConfirmedAccountsQueryRepository,
    private mailService: MailService,
  ) {}

  async execute({
    resendRegistrationEmailDto: { email },
  }: ResendRegistrationEmailCommand) {
    const notConfirmedAccount =
      await this.notConfirmedAccountsQueryRepository.getNotConfirmedAccountByEmail(
        email,
      );

    if (!notConfirmedAccount) {
      return;
    }

    const updatedNotConfirmedAccount =
      await notConfirmedAccount.updateConfirmation(
        this.notConfirmedAccountsRepository,
        this.notConfirmedAccountsQueryRepository,
      );

    if (!updatedNotConfirmedAccount) {
      return;
    }

    await this.mailService.sendRegistrationConfirmationMessage(
      email,
      updatedNotConfirmedAccount.confirmationCode,
    );
  }
}

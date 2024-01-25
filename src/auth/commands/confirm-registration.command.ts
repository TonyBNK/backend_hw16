import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotConfirmedAccountsQueryRepository } from '../../not-confirmed-accounts/not-confirmed-accounts.query-repository';
import { ConfirmRegistrationDto } from '../dto';

export class ConfirmRegistrationCommand {
  constructor(public readonly confirmRegistrationDto: ConfirmRegistrationDto) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationHandler
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(
    private notConfirmedAccountsQueryRepository: NotConfirmedAccountsQueryRepository,
  ) {}

  async execute({
    confirmRegistrationDto: { code },
  }: ConfirmRegistrationCommand): Promise<boolean> {
    const notConfirmedAccount =
      await this.notConfirmedAccountsQueryRepository.getNotConfirmedAccountByCode(
        code,
      );

    const result = await notConfirmedAccount!.deleteOne();

    return result.acknowledged && !!result.deletedCount;
  }
}

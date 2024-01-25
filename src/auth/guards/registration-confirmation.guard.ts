import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { NotConfirmedAccountsQueryRepository } from '../../not-confirmed-accounts/not-confirmed-accounts.query-repository';
import { ErrorResult } from '../../types';

@Injectable()
export class RegistrationConfirmationGuard implements CanActivate {
  constructor(
    private notConfirmedAccountsQueryRepository: NotConfirmedAccountsQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const code = request.body.code;

    const notConfirmedAccount =
      await this.notConfirmedAccountsQueryRepository.getNotConfirmedAccountByCode(
        code,
      );

    const errorResult: ErrorResult = {
      errorsMessages: [],
    };

    if (!notConfirmedAccount) {
      errorResult.errorsMessages!.push({
        field: 'code',
        message: 'Account does not exist or is already confirmed.',
      });

      throw new BadRequestException(errorResult);
    }

    const canConfirm = notConfirmedAccount.checkConfirmation(code);

    if (!canConfirm) {
      errorResult.errorsMessages!.push({
        field: 'code',
        message: 'Confirmation code is invalid or expired.',
      });

      throw new BadRequestException(errorResult);
    }

    return true;
  }
}

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { NotConfirmedAccountsQueryRepository } from '../../not-confirmed-accounts/not-confirmed-accounts.query-repository';
import { ErrorResult } from '../../types';

@Injectable()
export class RegistrationEmailResendingGuard implements CanActivate {
  constructor(
    private notConfirmedAccountsQueryRepository: NotConfirmedAccountsQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email;

    const notConfirmedAccount =
      await this.notConfirmedAccountsQueryRepository.getNotConfirmedAccountByEmail(
        email,
      );

    const errorResult: ErrorResult = {
      errorsMessages: [],
    };

    if (!notConfirmedAccount) {
      errorResult.errorsMessages!.push({
        field: 'email',
        message: 'Email does not exist or is already confirmed.',
      });

      throw new BadRequestException(errorResult);
    }

    return true;
  }
}

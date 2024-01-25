import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { NotRecoveredPasswordsQueryRepository } from '../../not-recovered-passwords/not-recovered-passwords.query-repository';
import { ErrorResult } from '../../types';

@Injectable()
export class NewPasswordGuard implements CanActivate {
  constructor(
    private notRecoveredPasswordsQueryRepository: NotRecoveredPasswordsQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const code = request.body.recoveryCode;

    const notRecoveredPassword =
      await this.notRecoveredPasswordsQueryRepository.getNotRecoveredPasswordByCode(
        code,
      );

    const errorResult: ErrorResult = {
      errorsMessages: [],
    };

    if (!notRecoveredPassword) {
      errorResult.errorsMessages!.push({
        field: 'code',
        message: 'Password does not have to be updated.',
      });

      throw new BadRequestException(errorResult);
    }

    const canRecovery = notRecoveredPassword.checkConfirmation(code);

    if (!canRecovery) {
      errorResult.errorsMessages!.push({
        field: 'code',
        message: 'Recovery code is invalid or expired.',
      });

      throw new BadRequestException(errorResult);
    }

    return true;
  }
}

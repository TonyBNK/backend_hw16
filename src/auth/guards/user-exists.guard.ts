import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ErrorResult } from '../../types';
import { UsersQueryRepository } from '../../users/users.query-repository';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const [userByEmail, userByLogin] = await Promise.all([
      this.usersQueryRepository.getUserByLoginOrEmail(request.body.email),
      this.usersQueryRepository.getUserByLoginOrEmail(request.body.login),
    ]);

    const errorResult: ErrorResult = {
      errorsMessages: [],
    };

    if (userByEmail) {
      errorResult.errorsMessages!.push({
        field: 'email',
        message: 'Such email already exists.',
      });
    }

    if (userByLogin) {
      errorResult.errorsMessages!.push({
        field: 'login',
        message: 'Such login already exists.',
      });
    }

    if (errorResult.errorsMessages!.length) {
      throw new BadRequestException(errorResult);
    }

    return true;
  }
}

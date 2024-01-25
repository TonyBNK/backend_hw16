import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersQueryRepository } from '../users.query-repository';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const id = request.params.userId || request.params.id;

    const user = await this.usersQueryRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('Such user does not exist!');
    }

    return true;
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../users.query-repository';

export class DeleteUserCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute({ id }: DeleteUserCommand): Promise<boolean> {
    const user = await this.usersQueryRepository.getUserById(id);

    if (!user) {
      return false;
    }

    const result = await user.deleteOne();

    return result.acknowledged && !!result.deletedCount;
  }
}

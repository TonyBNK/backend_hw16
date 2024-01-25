import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CreateExpiredTokenDto } from '../dto';
import {
  ExpiredTokenDocument,
  ExpiredTokenModelType,
} from '../expired-token.schema';
import { ExpiredTokensRepository } from '../expired-tokens.repository';

export class CreateExpiredTokenCommand {
  constructor(public readonly expiredTokenDto: CreateExpiredTokenDto) {}
}

@CommandHandler(CreateExpiredTokenCommand)
export class CreateExpiredTokenHandler
  implements ICommandHandler<CreateExpiredTokenCommand>
{
  constructor(
    @InjectModel('ExpiredToken')
    private ExpiredTokenModel: ExpiredTokenModelType,
    private expiredTokensRepository: ExpiredTokensRepository,
  ) {}

  async execute({
    expiredTokenDto,
  }: CreateExpiredTokenCommand): Promise<ExpiredTokenDocument> {
    const expiredToken = this.ExpiredTokenModel.createInstance(
      this.ExpiredTokenModel,
      expiredTokenDto,
    );

    return this.expiredTokensRepository.save(expiredToken);
  }
}

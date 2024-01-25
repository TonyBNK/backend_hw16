import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateExpiredTokenHandler } from './commands';
import { ExpiredToken, ExpiredTokenSchema } from './expired-token.schema';
import { ExpiredTokensQueryRepository } from './expired-tokens.query-repository';
import { ExpiredTokensRepository } from './expired-tokens.repository';

const ExpiredTokenModel = {
  name: ExpiredToken.name,
  schema: ExpiredTokenSchema,
};
const Services = [ExpiredTokensRepository, ExpiredTokensQueryRepository];
const CommandHandlers = [CreateExpiredTokenHandler];

@Module({
  imports: [MongooseModule.forFeature([ExpiredTokenModel]), CqrsModule],
  providers: [...Services, ...CommandHandlers],
  exports: [
    MongooseModule.forFeature([ExpiredTokenModel]),
    ExpiredTokensQueryRepository,
  ],
})
export class ExpiredTokensModule {}

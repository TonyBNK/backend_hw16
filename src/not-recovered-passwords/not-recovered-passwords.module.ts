import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotRecoveredPassword,
  NotRecoveredPasswordSchema,
} from './not-recovered-password.schema';
import { NotRecoveredPasswordsQueryRepository } from './not-recovered-passwords.query-repository';
import { NotRecoveredPasswordsRepository } from './not-recovered-passwords.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotRecoveredPassword.name, schema: NotRecoveredPasswordSchema },
    ]),
  ],
  providers: [
    NotRecoveredPasswordsRepository,
    NotRecoveredPasswordsQueryRepository,
  ],
  exports: [
    MongooseModule.forFeature([
      { name: NotRecoveredPassword.name, schema: NotRecoveredPasswordSchema },
    ]),
    NotRecoveredPasswordsRepository,
    NotRecoveredPasswordsQueryRepository,
  ],
})
export class NotRecoveredPasswordsModule {}

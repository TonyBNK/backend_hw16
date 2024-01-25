import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ExpiredTokensModule } from '../expired-tokens/expired-tokens.module';
import { MailModule } from '../mail/mail.module';
import { NotConfirmedAccountsModule } from '../not-confirmed-accounts/not-confirmed-accounts.module';
import { NotRecoveredPasswordsModule } from '../not-recovered-passwords/not-recovered-passwords.module';
import { SecurityDevicesModule } from '../security-devices/security-devices.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  ConfirmRegistrationHandler,
  LoginUserHandler,
  RecoverPasswordHandler,
  RefreshTokenHandler,
  RegisterUserHandler,
  ResendRegistrationEmailHandler,
  UpdatePasswordHandler,
} from './commands';
import { LogoutUserHandler } from './commands/logout-user.command';
import { LoginStrategy } from './strategies';

const Services = [AuthService, JwtService, LoginStrategy];
const CommandHandlers = [
  LoginUserHandler,
  UpdatePasswordHandler,
  RecoverPasswordHandler,
  ResendRegistrationEmailHandler,
  ConfirmRegistrationHandler,
  RegisterUserHandler,
  RefreshTokenHandler,
  LogoutUserHandler,
];

@Module({
  imports: [
    UsersModule,
    NotConfirmedAccountsModule,
    NotRecoveredPasswordsModule,
    PassportModule,
    MailModule,
    SecurityDevicesModule,
    ExpiredTokensModule,
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [...Services, ...CommandHandlers],
})
export class AuthModule {}

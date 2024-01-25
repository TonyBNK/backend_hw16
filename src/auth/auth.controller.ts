import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  SkipThrottle,
  Throttle,
  ThrottlerGuard,
  seconds,
} from '@nestjs/throttler';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto';
import { UsersQueryRepository } from '../users/users.query-repository';
import { mapMeToViewModel } from '../utils';
import {
  ConfirmRegistrationCommand,
  LoginUserCommand,
  RecoverPasswordCommand,
  RefreshTokenCommand,
  RegisterUserCommand,
  ResendRegistrationEmailCommand,
  UpdatePasswordCommand,
} from './commands';
import { LogoutUserCommand } from './commands/logout-user.command';
import { Cookies, Device, User } from './decorators';
import {
  ConfirmRegistrationDto,
  NewPasswordDto,
  PasswordRecoveryDto,
  ResendRegistrationEmailDto,
} from './dto';
import {
  AccessTokenGuard,
  LoginGuard,
  NewPasswordGuard,
  RefreshTokenGuard,
  RegistrationConfirmationGuard,
  RegistrationEmailResendingGuard,
  UserExistsGuard,
} from './guards';

@Controller('auth')
@Throttle({ default: { limit: 5, ttl: seconds(10) } })
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(UserExistsGuard)
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.commandBus.execute(new RegisterUserCommand(createUserDto));
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RegistrationConfirmationGuard)
  async confirmRegistration(
    @Body() confirmationRegistrationDto: ConfirmRegistrationDto,
  ) {
    return this.commandBus.execute(
      new ConfirmRegistrationCommand(confirmationRegistrationDto),
    );
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RegistrationEmailResendingGuard)
  async resendRegistrationEmail(
    @Body() resendRegistrationEmailDto: ResendRegistrationEmailDto,
  ) {
    return this.commandBus.execute(
      new ResendRegistrationEmailCommand(resendRegistrationEmailDto),
    );
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    return this.commandBus.execute(
      new RecoverPasswordCommand(passwordRecoveryDto),
    );
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(NewPasswordGuard)
  async updatePassword(@Body() newPasswordDto: NewPasswordDto) {
    return this.commandBus.execute(new UpdatePasswordCommand(newPasswordDto));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoginGuard)
  async login(
    @User() user: { id: string; login: string },
    @Device() device: { ip: string; title: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new LoginUserCommand({
        userId: user.id,
        userLogin: user.login,
        deviceTitle: device.title,
        deviceIp: device.ip,
      }),
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @SkipThrottle()
  async refreshToken(
    @Cookies('refreshToken') prevRefreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new RefreshTokenCommand(prevRefreshToken),
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async authMe(@User() user: { id: string; login: string }) {
    const userInfo = await this.usersQueryRepository.getUserById(user.id);

    return mapMeToViewModel(userInfo!);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  @SkipThrottle()
  async logout(@Cookies('refreshToken') refreshToken: string) {
    await this.commandBus.execute(new LogoutUserCommand(refreshToken));
  }
}

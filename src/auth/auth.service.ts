import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { NotConfirmedAccountsQueryRepository } from '../not-confirmed-accounts/not-confirmed-accounts.query-repository';
import { UserDocument } from '../users/user.schema';
import { UsersQueryRepository } from '../users/users.query-repository';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private notConfirmedAccountsQueryRepository: NotConfirmedAccountsQueryRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user =
      await this.usersQueryRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return null;
    }

    const notConfirmedAccount =
      await this.notConfirmedAccountsQueryRepository.getNotConfirmedAccountByEmail(
        user.email,
      );

    if (notConfirmedAccount) {
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.accountData.password,
    );

    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  }

  async generateTokens(userId: string, userLogin: string, deviceId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          login: userLogin,
        },
        {
          secret: jwtConstants.secret,
          expiresIn: '10s',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          login: userLogin,
          deviceId,
        },
        {
          secret: jwtConstants.secret,
          expiresIn: '20s',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  public validate = async (
    login: string,
    password: string,
  ): Promise<boolean> => {
    if (
      this.configService.get<string>('SUPER_ADMIN_LOGIN') === login &&
      this.configService.get<string>('SUPER_ADMIN_PASSWORD') === password
    ) {
      return true;
    }

    throw new UnauthorizedException();
  };
}

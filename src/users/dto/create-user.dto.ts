import { IsDefined, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsDefined()
  @Length(3, 10)
  @Matches(new RegExp(/^[a-zA-Z0-9_-]*$/), {
    message: 'login can contain only letters, numbers _ and -',
  })
  login: string;

  @IsString()
  @IsDefined()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), {
    message: 'email must be a valid email address',
  })
  email: string;
}

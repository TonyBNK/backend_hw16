import { IsDefined, IsString, Matches } from 'class-validator';

export class ResendRegistrationEmailDto {
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), {
    message: 'email must be a valid email address',
  })
  email: string;
}

import { IsDefined, IsString } from 'class-validator';

export class CreateExpiredTokenDto {
  @IsString()
  @IsDefined()
  token: string;
}

import { IsDefined, IsString, IsUUID, Length } from 'class-validator';

export class NewPasswordDto {
  @IsString()
  @IsDefined()
  @IsUUID(4)
  recoveryCode: string;

  @IsString()
  @IsDefined()
  @Length(6, 20)
  newPassword: string;
}

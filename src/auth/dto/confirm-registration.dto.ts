import { IsDefined, IsString, IsUUID } from 'class-validator';

export class ConfirmRegistrationDto {
  @IsString()
  @IsDefined()
  @IsUUID(4)
  code: string;
}

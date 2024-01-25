import { IsDefined, IsMongoId, IsString } from 'class-validator';

export class CreateSecurityDeviceDto {
  @IsString()
  @IsDefined()
  title: string;

  @IsString()
  @IsDefined()
  @IsMongoId()
  userId: string;

  @IsString()
  @IsDefined()
  ip: string;
}

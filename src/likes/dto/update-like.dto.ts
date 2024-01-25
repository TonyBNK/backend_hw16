import {
  IsDefined,
  IsEnum,
  IsMongoId,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { LikeStatus, LikeableEntity } from '../../constants';

export class UpdateLikeDto {
  @IsString()
  @IsDefined()
  @IsMongoId()
  entityId: string;

  @IsEnum(LikeableEntity)
  @IsDefined()
  entityType: LikeableEntity;

  @IsString()
  @IsDefined()
  @IsMongoId()
  userId: string;

  @IsString()
  @IsDefined()
  @Length(3, 10)
  @Matches(new RegExp(/^[a-zA-Z0-9_-]*$/), {
    message: 'login can contain only letters, numbers _ and -',
  })
  login: string;

  @IsEnum(LikeStatus)
  @IsDefined()
  likeStatus: LikeStatus;
}

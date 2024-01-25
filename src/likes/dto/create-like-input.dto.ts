import { IsDefined, IsEnum } from 'class-validator';
import { LikeStatus } from '../../constants';

export class CreateLikeInputDto {
  @IsEnum(LikeStatus)
  @IsDefined()
  likeStatus: LikeStatus;
}

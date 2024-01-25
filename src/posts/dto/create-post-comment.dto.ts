import {
  IsDefined,
  IsMongoId,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreatePostCommentDto {
  @IsString()
  @IsDefined()
  @Length(20, 300)
  content: string;

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
  userLogin: string;
}

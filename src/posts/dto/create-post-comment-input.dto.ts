import { IsDefined, IsString, Length } from 'class-validator';

export class CreatePostCommentInputDto {
  @IsString()
  @IsDefined()
  @Length(20, 300)
  content: string;
}

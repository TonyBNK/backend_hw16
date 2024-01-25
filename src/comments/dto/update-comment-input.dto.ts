import { IsDefined, IsString, Length } from 'class-validator';

export class UpdateCommentInputDto {
  @IsString()
  @IsDefined()
  @Length(20, 300)
  content: string;
}

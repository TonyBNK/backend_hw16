import {
  IsDefined,
  IsMongoId,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { IsBlogExists } from '../decorators/is-blog-exists.decorator';

export class CreatePostDto {
  @IsString()
  @IsDefined()
  @Length(1, 30)
  @Matches(new RegExp(/^(?!\s).+(?<!\s)$/gm), {
    message: 'title must contain symbols',
  })
  title: string;

  @IsString()
  @IsDefined()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @IsDefined()
  @Length(1, 1000)
  @Matches(new RegExp(/^(?!\s).+(?<!\s)$/gm), {
    message: 'content must contain symbols',
  })
  content: string;

  @IsString()
  @IsDefined()
  @IsMongoId()
  @IsBlogExists()
  blogId: string;
}

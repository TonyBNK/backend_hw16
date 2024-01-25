import { IsDefined, IsString, Length, Matches } from 'class-validator';

export class CreateBlogPostDto {
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
}

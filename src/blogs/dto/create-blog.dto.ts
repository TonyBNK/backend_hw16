import { IsDefined, IsString, Length, Matches } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^(?!\s).+(?<!\s)$/gm), {
    message: 'name must contain symbols',
  })
  @Length(1, 15)
  name: string;

  @IsString()
  @IsDefined()
  @Length(1, 500)
  description: string;

  @IsString()
  @IsDefined()
  @Length(1, 100)
  @Matches(
    new RegExp(
      '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$',
    ),
    { message: 'websiteUrl must match website regular expression' },
  )
  websiteUrl: string;
}

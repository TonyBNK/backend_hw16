import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { SortDirection } from '../../constants';
import { PostViewModel } from '../../types';
import { postViewModelKeys } from '../../types/view/post';

export class GetPostsDto {
  @IsIn(postViewModelKeys)
  @IsOptional()
  sortBy?: keyof PostViewModel | null;

  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  pageNumber?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  pageSize?: number;
}

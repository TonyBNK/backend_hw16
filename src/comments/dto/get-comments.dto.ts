import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { SortDirection } from '../../constants';
import { CommentViewModel } from '../../types';
import { commentViewModelKeys } from '../../types/view/comment';

export class GetCommentsDto {
  @IsIn(commentViewModelKeys)
  @IsOptional()
  sortBy?: keyof CommentViewModel | null;

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

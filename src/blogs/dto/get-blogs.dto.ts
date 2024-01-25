import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { SortDirection } from '../../constants';
import { BlogViewModel } from '../../types';
import { blogViewModelKeys } from '../../types/view/blog';

export class GetBlogsDto {
  @IsString()
  @IsOptional()
  searchNameTerm?: string | null;

  @IsIn(blogViewModelKeys)
  @IsOptional()
  sortBy?: keyof BlogViewModel | null;

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

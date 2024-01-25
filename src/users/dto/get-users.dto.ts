import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { SortDirection } from '../../constants';
import { UserViewModel } from '../../types';
import { userViewModelKeys } from '../../types/view/user';

export class GetUsersDto {
  @IsString()
  @IsOptional()
  searchLoginTerm?: string | null;

  @IsString()
  @IsOptional()
  searchEmailTerm?: string | null;

  @IsIn(userViewModelKeys)
  @IsOptional()
  sortBy?: keyof UserViewModel | null;

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

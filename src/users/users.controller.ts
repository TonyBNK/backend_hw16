import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../auth/guards';
import { Paginator, UserViewModel } from '../types';
import { mapPaginatorToViewModel, mapUserToViewModel } from '../utils';
import { CreateUserCommand, DeleteUserCommand } from './commands';
import { GetUsersDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserExistsGuard } from './guards';
import { UsersQueryRepository } from './users.query-repository';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<UserViewModel> {
    const user = await this.commandBus.execute(new CreateUserCommand(body));

    return mapUserToViewModel(user);
  }

  @Get()
  async getUsers(
    @Query() query?: GetUsersDto,
  ): Promise<Paginator<UserViewModel>> {
    const users = await this.usersQueryRepository.getUsers(query);

    return mapPaginatorToViewModel(mapUserToViewModel)(users);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(UserExistsGuard)
  async deleteUser(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}

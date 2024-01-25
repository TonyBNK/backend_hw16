import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserSchema } from '../user.schema';
import { UsersModule } from '../users.module';
import { UsersQueryRepository } from '../users.query-repository';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [UsersService, UsersRepository, UsersQueryRepository],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue(UserSchema)
      .compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});

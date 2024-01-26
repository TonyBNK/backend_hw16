import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ErrorResult, Paginator, UserViewModel } from '../../src/types';
import { CreateUserDto } from '../../src/users/dto';
import {
  basicAuth,
  createFakeMongoId,
  createTestApp,
  routerPaths,
} from '../utils';

describe('Users e2e', () => {
  let app: INestApplication;
  let server: App;
  let newUser: UserViewModel | null = null;

  const fakeId = createFakeMongoId();
  const emptyGetAllResponse: Paginator<UserViewModel> = {
    totalCount: 0,
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    items: [],
  };

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();

    await request(server)
      .delete(`${routerPaths.testing}/all-data`)
      .expect(HttpStatus.NO_CONTENT);
  });

  afterAll(async () => {
    await request(server)
      .delete(`${routerPaths.testing}/all-data`)
      .expect(HttpStatus.NO_CONTENT);

    await app.close();
  });

  describe('- GET Users', () => {
    it('should return status 401 without authorization', async () => {
      await request(server)
        .get(routerPaths.users)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('+ GET Users', () => {
    it('should return empty users with status 200', async () => {
      await request(server)
        .get(routerPaths.users)
        .set(basicAuth)
        .expect(HttpStatus.OK, emptyGetAllResponse);
    });
  });

  describe('- POST Users', () => {
    afterEach(async () => {
      await request(server)
        .get(routerPaths.users)
        .set(basicAuth)
        .expect(HttpStatus.OK, emptyGetAllResponse);
    });

    it('should return status 401 without authorization', async () => {
      await request(server)
        .post(routerPaths.users)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 with incorrect input data', async () => {
      const inputData: CreateUserDto = {
        login: '',
        password: '',
        email: '',
      };

      const errorResult: ErrorResult = {
        errorsMessages: [
          {
            field: 'login',
            message: 'login must be longer than or equal to 3 characters',
          },
          {
            field: 'password',
            message: 'password must be longer than or equal to 6 characters',
          },
          {
            field: 'email',
            message: 'email must be a valid email address',
          },
        ],
      };

      await request(server)
        .post(routerPaths.users)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.BAD_REQUEST, errorResult);
    });
  });

  describe('+ POST Users', () => {
    beforeEach(async () => {
      await request(server)
        .delete(`${routerPaths.testing}/all-data`)
        .expect(HttpStatus.NO_CONTENT);
    });

    afterEach(async () => {
      const response = await request(server)
        .get(routerPaths.users)
        .set(basicAuth)
        .expect(HttpStatus.OK);

      expect(response.body.totalCount).toEqual(1);
      expect(response.body.items.length).toEqual(1);
    });

    it('should return new user with status 201', async () => {
      const inputData: CreateUserDto = {
        login: 'User_1',
        password: '1234567',
        email: 'newuser@example.com',
      };

      const response = await request(server)
        .post(routerPaths.users)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.CREATED);

      newUser = response.body;

      const expectedResponse: Paginator<UserViewModel> = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newUser!],
      };

      await request(server)
        .get(routerPaths.users)
        .set(basicAuth)
        .expect(HttpStatus.OK, expectedResponse);
    });
  });

  describe('- DELETE Users', () => {
    afterEach(async () => {
      const expectedResponse: Paginator<UserViewModel> = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newUser!],
      };

      await request(server)
        .get(routerPaths.users)
        .set(basicAuth)
        .expect(HttpStatus.OK, expectedResponse);
    });

    it('should return status 401 without authorization', async () => {
      await request(server)
        .delete(`${routerPaths.users}/${newUser!.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 404 if user does not exist', async () => {
      await request(server)
        .delete(`${routerPaths.users}/${fakeId}`)
        .set(basicAuth)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('+ DELETE Users', () => {
    afterEach(async () => {
      await request(server)
        .get(routerPaths.users)
        .set(basicAuth)
        .expect(HttpStatus.OK, emptyGetAllResponse);
    });

    it('should delete user', async () => {
      await request(server)
        .delete(`${routerPaths.users}/${newUser?.id}`)
        .set(basicAuth)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});

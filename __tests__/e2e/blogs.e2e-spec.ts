import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  CreateBlogDto,
  CreateBlogPostDto,
  UpdateBlogDto,
} from '../../src/blogs/dto';
import {
  BlogViewModel,
  ErrorResult,
  Paginator,
  PostViewModel,
} from '../../src/types';
import {
  basicAuth,
  createFakeMongoId,
  createTestApp,
  routerPaths,
} from '../utils';

describe('Blogs e2e', () => {
  let app: INestApplication;
  let server: App;
  let newBlog: BlogViewModel | null = null;
  let newPost: PostViewModel | null = null;

  const fakeBlogId = createFakeMongoId();
  const emptyGetAllResponse: Paginator<BlogViewModel> = {
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

  describe('+ GET Blogs', () => {
    it('should return empty blogs with status 200', async () => {
      await request(server)
        .get(routerPaths.blogs)
        .expect(HttpStatus.OK, emptyGetAllResponse);
    });
  });

  describe('- POST Blogs', () => {
    afterEach(async () => {
      await request(server)
        .get(routerPaths.blogs)
        .expect(HttpStatus.OK, emptyGetAllResponse);
    });

    it('should return status 401 without authorization', async () => {
      await request(server)
        .post(routerPaths.blogs)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 with incorrect input data', async () => {
      const inputData: CreateBlogDto = {
        name: '',
        description: '',
        websiteUrl: '',
      };

      const errorResult: ErrorResult = {
        errorsMessages: [
          {
            field: 'name',
            message: 'name must be longer than or equal to 1 characters',
          },
          {
            field: 'description',
            message: 'description must be longer than or equal to 1 characters',
          },
          {
            field: 'websiteUrl',
            message: 'websiteUrl must match website regular expression',
          },
        ],
      };

      await request(server)
        .post(routerPaths.blogs)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.BAD_REQUEST, errorResult);
    });
  });

  describe('+ POST Blogs', () => {
    afterAll(async () => {
      const response = await request(server)
        .get(routerPaths.blogs)
        .expect(HttpStatus.OK);

      expect(response.body.totalCount).toEqual(1);
      expect(response.body.items.length).toEqual(1);
    });

    it('should return new blog with status 201', async () => {
      const inputData: CreateBlogDto = {
        name: 'Blog 1',
        description: 'some description',
        websiteUrl: 'https://nextWebsiteUrl.com',
      };

      const response = await request(server)
        .post(routerPaths.blogs)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.CREATED);

      newBlog = response.body;

      const expectedResponse: Paginator<BlogViewModel> = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newBlog!],
      };

      await request(server)
        .get(routerPaths.blogs)
        .expect(HttpStatus.OK, expectedResponse);
    });
  });

  describe('- GET Blog Posts', () => {
    it('should return status 404 if blog does not exist', async () => {
      await request(server)
        .get(`${routerPaths.blogs}/${fakeBlogId}/posts`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('+ GET Blog Posts', () => {
    it('should return empty blog posts with status 200', async () => {
      const response = await request(server)
        .get(`${routerPaths.blogs}/${newBlog!.id}/posts`)
        .expect(HttpStatus.OK);

      const blogPosts: Paginator<PostViewModel> = response.body;

      expect(blogPosts.totalCount).toEqual(0);
      expect(blogPosts.items.length).toEqual(0);
    });
  });

  describe('- POST Blog Posts', () => {
    afterEach(async () => {
      const response = await request(server)
        .get(`${routerPaths.blogs}/${newBlog!.id}/posts`)
        .expect(HttpStatus.OK);

      const blogPosts: Paginator<PostViewModel> = response.body;

      expect(blogPosts.totalCount).toEqual(0);
      expect(blogPosts.items.length).toEqual(0);
    });

    it('should return status 401 without authorization', async () => {
      await request(server)
        .post(`${routerPaths.blogs}/${newBlog!.id}/posts`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 with incorrect input data', async () => {
      const inputData: CreateBlogPostDto = {
        title: '',
        shortDescription: '',
        content: '',
      };

      const errorResult: ErrorResult = {
        errorsMessages: [
          {
            field: 'title',
            message: 'title must contain symbols',
          },
          {
            field: 'shortDescription',
            message:
              'shortDescription must be longer than or equal to 1 characters',
          },
          {
            field: 'content',
            message: 'content must contain symbols',
          },
        ],
      };

      await request(server)
        .post(`${routerPaths.blogs}/${newBlog!.id}/posts`)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.BAD_REQUEST, errorResult);
    });

    it('should return status 404 if blog does not exist', async () => {
      const inputData: CreateBlogPostDto = {
        title: 'Post 1',
        shortDescription: 'string',
        content: 'string',
      };

      await request(server)
        .post(`${routerPaths.blogs}/${fakeBlogId}/posts`)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('+ POST Blog Posts', () => {
    afterAll(async () => {
      const response = await request(server)
        .get(`${routerPaths.blogs}/${newBlog!.id}/posts`)
        .expect(HttpStatus.OK);

      const blogPosts: Paginator<PostViewModel> = response.body;

      expect(blogPosts.totalCount).toEqual(1);
      expect(blogPosts.items.length).toEqual(1);
    });

    it('should return new blog post with status 201', async () => {
      const inputData: CreateBlogPostDto = {
        title: 'Post 1',
        shortDescription: 'string',
        content: 'string',
      };

      const response = await request(server)
        .post(`${routerPaths.blogs}/${newBlog!.id}/posts`)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.CREATED);

      newPost = response.body;

      const expectedResponse: Paginator<PostViewModel> = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newPost!],
      };

      await request(server)
        .get(`${routerPaths.blogs}/${newBlog!.id}/posts`)
        .expect(HttpStatus.OK, expectedResponse);
    });
  });

  describe('- PUT Blogs', () => {
    afterEach(async () => {
      const expectedResponse: Paginator<BlogViewModel> = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newBlog!],
      };

      await request(server)
        .get(routerPaths.blogs)
        .expect(HttpStatus.OK, expectedResponse);
    });

    it('should return status 401 without authorization', async () => {
      const inputData: UpdateBlogDto = {
        name: '',
        description: '',
        websiteUrl: '',
      };

      await request(server)
        .put(`${routerPaths.blogs}/${newBlog?.id}`)
        .send(inputData)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 with incorrect input data', async () => {
      const inputData: UpdateBlogDto = {
        name: '',
        description: '',
        websiteUrl: '',
      };

      const errorResult: ErrorResult = {
        errorsMessages: [
          {
            field: 'name',
            message: 'name must be longer than or equal to 1 characters',
          },
          {
            field: 'description',
            message: 'description must be longer than or equal to 1 characters',
          },
          {
            field: 'websiteUrl',
            message: 'websiteUrl must match website regular expression',
          },
        ],
      };

      await request(server)
        .put(`${routerPaths.blogs}/${newBlog?.id}`)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.BAD_REQUEST, errorResult);
    });
  });

  describe('+ PUT Blogs', () => {
    afterEach(async () => {
      const expectedResponse: Paginator<BlogViewModel> = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newBlog!],
      };

      await request(server)
        .get(routerPaths.blogs)
        .expect(HttpStatus.OK, expectedResponse);
    });

    it('should update blog with status 204', async () => {
      const inputData: UpdateBlogDto = {
        name: 'upd Blog 1',
        description: 'upd description',
        websiteUrl: 'https://updWebsiteUrl.com',
      };

      await request(server)
        .put(`${routerPaths.blogs}/${newBlog?.id}`)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.NO_CONTENT);

      const response = await request(server).get(routerPaths.blogs);
      const updatedBlog = response.body.items.find(
        (blog: BlogViewModel) => blog.id === newBlog!.id,
      );

      expect(updatedBlog).toEqual({ ...newBlog, ...inputData });

      newBlog = updatedBlog;
    });
  });

  describe('- GET Blog', () => {
    it('should return status 404 if blog does not exist', async () => {
      await request(server)
        .get(`${routerPaths.blogs}/${fakeBlogId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('+ GET Blog', () => {
    it('should return blog with status 200', async () => {
      await request(server)
        .get(`${routerPaths.blogs}/${newBlog!.id}`)
        .expect(HttpStatus.OK, newBlog);
    });
  });

  describe('- DELETE Blogs', () => {
    afterEach(async () => {
      const expectedResponse: Paginator<BlogViewModel> = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newBlog!],
      };

      await request(server)
        .get(routerPaths.blogs)
        .expect(HttpStatus.OK, expectedResponse);
    });

    it('should return status 401 without authorization', async () => {
      await request(server)
        .delete(`${routerPaths.blogs}/${newBlog!.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 404 if blog does not exist', async () => {
      await request(server)
        .delete(`${routerPaths.blogs}/${fakeBlogId}`)
        .set(basicAuth)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('+ DELETE Blogs', () => {
    afterEach(async () => {
      await request(server)
        .get(routerPaths.blogs)
        .expect(HttpStatus.OK, emptyGetAllResponse);
    });

    it('should delete blog', async () => {
      await request(server)
        .delete(`${routerPaths.blogs}/${newBlog?.id}`)
        .set(basicAuth)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});

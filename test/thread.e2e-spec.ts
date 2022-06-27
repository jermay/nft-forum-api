import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { CreateThreadDto } from '../src/thread/dto/create-thread.dto';
import { UpdateThreadDto } from '../src/thread/dto/update-thread.dto';
import { Thread } from '../src/thread/entities/thread.entity';
import { ThreadService } from '../src/thread/thread.service';
import { UserService } from '../src/user/user.service';
import { AuthFactory } from './factories/auth.factory';
import {
  getThreadDtoWithUser,
  ThreadFactory,
  ThreadFactoryCreate,
} from './factories/thread.factory';
import { UserFactory } from './factories/user.factory';
import { clearDatabase, getTestApplication } from './mocks/utils';

describe('ThreadController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let module: TestingModule;
  let authFactory: AuthFactory;
  let threadService: ThreadService;
  let threadFactory: ThreadFactory;

  beforeAll(async () => {
    ({ app, module, server } = await getTestApplication());

    const authService = module.get<AuthService>(AuthService);
    const userService = module.get<UserService>(UserService);
    const userFactory = new UserFactory(userService);
    authFactory = new AuthFactory(authService, userFactory);

    threadService = module.get<ThreadService>(ThreadService);
    threadFactory = new ThreadFactory(threadService);
  });

  afterEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  const postThread = (dto: CreateThreadDto, token: string) => {
    const req = request(server).post('/thread').send(dto);
    if (token) req.auth(token, { type: 'bearer' });
    return req;
  };

  const expectThread = (result: Thread, expected: Thread) => {
    expect(result.id).toEqual(expected.id);
    expect(result.postId).toEqual(expected.postId);
    expect(result.title).toEqual(expected.title);
  };

  const expectThreadWithComments = (
    result: Thread,
    { thread, dto }: ThreadFactoryCreate,
  ) => {
    expectThread(result, thread);
    expect(result.comments).toHaveLength(1);
    const post = result.comments[0];
    expect(post.author).toEqual(dto.post.author);
    expect(post.content).toEqual(dto.post.content);
  };

  describe('/thread POST', () => {
    it('should create a new thread', async () => {
      const { user, authToken } = await authFactory.resisterTestUser();
      const dto = getThreadDtoWithUser(user);

      const { status, body } = await postThread(dto, authToken);
      expect(status).toEqual(201);

      const result = body as Thread;
      expect(result.title).toEqual(dto.title);
      expect(result.id).toBeGreaterThan(0);
      expect(result.postId).toBeGreaterThan(0);

      const thread = await threadService.findOne(result.id);
      expect(thread.title).toEqual(dto.title);
      expect(thread.comments).toHaveLength(1);
      const post = thread.comments[0];
      expect(post.author).toEqual(dto.post.author);
      expect(post.content).toEqual(dto.post.content);
    });
  });

  describe('/thread GET', () => {
    const getThreads = (token: string) => {
      const req = request(server).get(`/thread`);
      if (token) req.auth(token, { type: 'bearer' });
      return req;
    };

    it('should get all threads', async () => {
      const { user, authToken } = await authFactory.resisterTestUser();
      const threads = await threadFactory.bulkCreate(3, user);

      const { status, body } = await getThreads(authToken);
      expect(status).toEqual(200);

      const result = body as Thread[];
      expect(result).toHaveLength(3);
      threads.forEach(({ thread }) => {
        const resultThread = result.find((r) => r.id === thread.id);
        expectThread(resultThread, thread);
      });
    });
  });

  describe('/thread/:id GET', () => {
    const getThreadById = (id: number, token: string) => {
      const req = request(server).get(`/thread/${id}`);
      if (token) req.auth(token, { type: 'bearer' });
      return req;
    };

    it('should get a thread by id', async () => {
      const { user, authToken } = await authFactory.resisterTestUser();
      const { thread, dto } = await threadFactory.createWithUser(user);

      const { status, body } = await getThreadById(thread.id, authToken);
      expect(status).toEqual(200);

      expectThreadWithComments(body, { thread, dto });
    });
  });

  describe('/thread/:id PATCH', () => {
    const patchThread = (id: number, vals: UpdateThreadDto, token: string) => {
      const req = request(server).patch(`/thread/${id}`).send(vals);
      if (token) req.auth(token, { type: 'bearer' });
      return req;
    };

    it('should update an existing thread', async () => {
      const { user, authToken } = await authFactory.resisterTestUser();
      const { thread, dto } = await threadFactory.createWithUser(user);
      const updateVals: UpdateThreadDto = {
        title: 'new title',
        post: {
          author: dto.post.author,
          content: 'new content',
        },
      };

      const { status } = await patchThread(thread.id, updateVals, authToken);
      expect(status).toEqual(200);

      const saved = await threadService.findOne(thread.id);
      expect(saved.title).toEqual(updateVals.title);
      const savedPost = saved.comments[0];
      expect(savedPost.author).toEqual(dto.post.author);
      expect(savedPost.content).toEqual(updateVals.post.content);
    });

    it.todo('should NOT update the thread author');
  });

  describe('/thread/:id DELETE', () => {
    const deleteThread = (id: number, token: string) => {
      const req = request(server).delete(`/thread/${id}`);
      if (token) req.auth(token, { type: 'bearer' });
      return req;
    };

    it('should delete an existing thread', async () => {
      const { user, authToken } = await authFactory.resisterTestUser();
      const { thread } = await threadFactory.createWithUser(user);

      const { status } = await deleteThread(thread.id, authToken);
      expect(status).toEqual(200);

      const result = await threadService.findOne(thread.id);
      expect(result).toBeFalsy();
    });
  });
});

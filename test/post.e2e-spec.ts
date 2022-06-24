import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { CreateThreadDto } from '../src/thread/dto/create-thread.dto';
import { Thread } from '../src/thread/entities/thread.entity';
import { ThreadService } from '../src/thread/thread.service';
import { UserService } from '../src/user/user.service';
import { AuthFactory } from './factories/auth.factory';
import {
  getThreadDtoWithUser,
  ThreadFactory,
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
    const getThread = (id: number, token: string) => {
      const req = request(server).get(`/thread/${id}`);
      if (token) req.auth(token, { type: 'bearer' });
      return req;
    };

    it('should get a thread by id', async () => {
      const { user, authToken } = await authFactory.resisterTestUser();
      const { thread, dto } = await threadFactory.create(user);

      const { status, body } = await getThread(thread.id, authToken);
      expect(status).toEqual(200);

      const result = body as Thread;
      expect(result.id).toEqual(thread.id);
      expect(result.title).toEqual(thread.title);
      expect(result.comments).toHaveLength(1);

      const comment = result.comments[0];
      expect(comment.author).toEqual(dto.post.author);
      expect(comment.content).toEqual(dto.post.content);
    });
  });
});

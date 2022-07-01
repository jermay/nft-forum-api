import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { CreatePostDto } from '../src/post/dto/create-post.dto';
import { UpdatePostDto } from '../src/post/dto/update-post.dto';
import { Post } from '../src/post/entities/post.entity';
import { PostService } from '../src/post/post.service';
import { ThreadService } from '../src/thread/thread.service';
import { UserService } from '../src/user/user.service';
import { AuthFactory } from './factories/auth.factory';
import {
  getCreatePostDtoWithUser,
  PostFactory,
} from './factories/post.factory';
import { ThreadFactory } from './factories/thread.factory';
import { UserFactory } from './factories/user.factory';
import { clearDatabase, getTestApplication } from './mocks/utils';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let module: TestingModule;
  let authFactory: AuthFactory;
  let threadService: ThreadService;
  let threadFactory: ThreadFactory;
  let postService: PostService;
  let postFactory: PostFactory;

  beforeAll(async () => {
    ({ app, module, server } = await getTestApplication());

    const authService = module.get<AuthService>(AuthService);
    const userService = module.get<UserService>(UserService);
    const userFactory = new UserFactory(userService);
    authFactory = new AuthFactory(authService, userFactory);

    threadService = module.get<ThreadService>(ThreadService);
    threadFactory = new ThreadFactory(threadService);

    postService = module.get<PostService>(PostService);
    postFactory = new PostFactory(postService);
  });

  afterEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  const postComment = (threadId: number, dto: CreatePostDto, token: string) => {
    const req = request(server).post(`/comment/${threadId}`).send(dto);
    if (token) req.auth(token, { type: 'bearer' });
    return req;
  };

  const createOriginalPost = async () => {
    const { user: opUser } = await authFactory.resisterTestUser();
    const { user: commentUser, authToken } =
      await authFactory.resisterTestUser();
    const { thread } = await threadFactory.createWithUser(opUser);
    return {
      opUser,
      commentUser,
      commentUserAuthToken: authToken,
      thread,
    };
  };

  const createPostWithComment = async () => {
    const { commentUser, commentUserAuthToken, thread } =
      await createOriginalPost();
    const comment = await postFactory.createWithUser(commentUser, thread);
    return {
      comment,
      thread,
      user: commentUser,
      authToken: commentUserAuthToken,
    };
  };

  const deletePost = (postId: number, token: string) => {
    const req = request(server).delete(`/comment/${postId}`);
    if (token) req.auth(token, { type: 'bearer' });
    return req;
  };

  const patchPost = (postId: number, dto: UpdatePostDto, token: string) => {
    const req = request(server).patch(`/comment/${postId}`).send(dto);
    if (token) req.auth(token, { type: 'bearer' });
    return req;
  };

  describe('/comment/:threadId POST', () => {
    it('should create a new comment on an existing post', async () => {
      const { commentUser, commentUserAuthToken, thread } =
        await createOriginalPost();
      const dto = getCreatePostDtoWithUser(commentUser);

      const { status, body } = await postComment(
        thread.id,
        dto,
        commentUserAuthToken,
      );
      expect(status).toEqual(201);

      const result = body as Post;
      expect(result.id).toBeGreaterThan(0);
      expect(result.threadId).toEqual(thread.id);
      expect(result.author).toEqual(commentUser.username);
      expect(result.content).toEqual(dto.content);
    });

    it('should return status 401 if the auth token is not provided', async () => {
      const { commentUser, thread } = await createOriginalPost();
      const dto = getCreatePostDtoWithUser(commentUser);

      const { status } = await postComment(thread.id, dto, undefined);
      expect(status).toEqual(401);
    });
  });

  describe('/comment/:id DELETE', () => {
    it('should delete an existing comment made by the caller', async () => {
      const { authToken, comment } = await createPostWithComment();

      const { status } = await deletePost(comment.id, authToken);
      expect(status).toEqual(200);

      // should be deleted in the database
      const savedPost = await Post.findByPk(comment.id);
      expect(savedPost).toBeFalsy();
    });

    it('should return status 401 if the auth token was not provided', async () => {
      const { comment } = await createPostWithComment();
      const { status } = await deletePost(comment.id, undefined);
      expect(status).toEqual(401);
    });

    it('should return status 403 if the comment does NOT belong to the caller', async () => {
      const { comment } = await createPostWithComment();
      const badUser = await authFactory.resisterTestUser();
      expect(badUser.user.username).not.toEqual(comment.author);

      const { status, text } = await deletePost(comment.id, badUser.authToken);
      expect(status).toEqual(403);
      expect(text).toMatch(/user is not the author/i);
    });
  });

  describe('/comment/:postId PATCH', () => {
    it('should update an existing post of the user', async () => {
      const { comment, authToken } = await createPostWithComment();
      const toUpdate: UpdatePostDto = {
        content: 'updated content',
      };

      const { status } = await patchPost(comment.id, toUpdate, authToken);
      expect(status).toEqual(200);

      const savedComment = await postService.findOne(comment.id);
      expect(savedComment.author).toEqual(comment.author);
      expect(savedComment.content).toEqual(toUpdate.content);
    });

    it('should return status 401 if the auth token was not provided', async () => {
      const { comment } = await createPostWithComment();
      const toUpdate: UpdatePostDto = {
        content: 'updated content',
      };

      const { status } = await patchPost(comment.id, toUpdate, undefined);
      expect(status).toEqual(401);
    });

    it('should return status 403 if the caller is not the author', async () => {
      const badUser = await authFactory.resisterTestUser();
      const { comment } = await createPostWithComment();
      const toUpdate: UpdatePostDto = {
        content: 'updated content',
      };

      const { status } = await patchPost(
        comment.id,
        toUpdate,
        badUser.authToken,
      );
      expect(status).toEqual(403);
    });
  });
});

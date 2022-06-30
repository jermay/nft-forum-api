import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { mockPost } from '../../test/mocks/thread.mock';
import { Post } from '../post/entities/post.entity';
import { PostService } from '../post/post.service';
import { PostAuthorGuard } from './post-author.guard';
import { mockExcutionContext } from '../../test/mocks/execution-context.mock';
import { User } from '../user/user.entity';
import { mockUser } from '../../test/mocks/user.mock';

describe('PostAuthorGuard', () => {
  let guard: PostAuthorGuard;
  let postService: DeepMocked<PostService>;
  let post: Post;
  let user: User;

  beforeEach(() => {
    user = mockUser();
    post = mockPost(undefined, { author: user.username });
    postService = createMock<PostService>();
    postService.findOne.mockResolvedValue(post);
    guard = new PostAuthorGuard(postService);
  });

  const createContext = (
    params: Record<string, number>,
    user: User,
  ): ExecutionContext => {
    return mockExcutionContext({
      params,
      body: {},
      user,
    });
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true for a comment when the authenticated caller matches the post author', async () => {
    const context = createContext({ postId: post.id }, user);
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw a Forbidden expception if the caller is not the post author', async () => {
    const badUser = mockUser();
    const context = createContext({ postId: post.id }, badUser);

    await expect(() => guard.canActivate(context)).rejects.toThrowError(
      ForbiddenException,
    );
  });

  it('should throw an Unauthorized exception if the caller is not authenticated', async () => {
    const context = createContext({ postId: post.id }, undefined);

    await expect(() => guard.canActivate(context)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw a BadRequest exception if the post id param is not provided', async () => {
    const context = createContext(undefined, user);

    await expect(() => guard.canActivate(context)).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('should throw a BadRequestExcpetion if the post id does not exist', async () => {
    postService.findOne.mockResolvedValue(null);
    const context = createContext({ postId: post.id }, user);

    await expect(() => guard.canActivate(context)).rejects.toThrowError(
      BadRequestException,
    );
  });
});

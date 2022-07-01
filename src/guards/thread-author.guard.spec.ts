import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { mockThread } from '../../test/mocks/thread.mock';
// import { Post } from '../post/entities/post.entity';
// import { PostService } from '../post/post.service';
// import { PostAuthorGuard } from './post-author.guard';
import { mockExcutionContext } from '../../test/mocks/execution-context.mock';
import { User } from '../user/user.entity';
import { mockUser } from '../../test/mocks/user.mock';
import { getThreadDtoWithUser } from '../../test/factories/thread.factory';
import { ThreadService } from '../thread/thread.service';
import { ThreadAuthorGuard } from './thread-author.guard';
import { Thread } from '../thread/entities/thread.entity';

describe('ThreadAuthorGuard', () => {
  let guard: ThreadAuthorGuard;
  // let postService: DeepMocked<PostService>;
  // let post: Post;
  let thread: Thread;
  let threadService: DeepMocked<ThreadService>;
  let user: User;

  beforeEach(() => {
    user = mockUser();
    thread = mockThread(getThreadDtoWithUser(user));
    // post = mockPost(undefined, { author: user.username });
    // postService = createMock<PostService>();
    // postService.findOne.mockResolvedValue(post);
    threadService = createMock<ThreadService>();
    threadService.findOne.mockResolvedValue(thread);
    guard = new ThreadAuthorGuard(threadService);
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

  it('should return true for a thread when the authenticated caller matches the post author', async () => {
    // const dto = getThreadDtoWithUser(user);
    // const thread = mockThread(dto);
    // const threadPost = mockPost(thread.id, dto.post);
    // threadService.findOne.mockResolvedValue(thread);
    // postService.findOne.mockImplementation(async (id) =>
    //   id === thread.postId ? threadPost : null,
    // );

    const context = createContext({ threadId: thread.id }, user);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw a Forbidden expception if the caller is not the post author', async () => {
    const badUser = mockUser();
    const context = createContext({ threadId: thread.id }, badUser);

    await expect(() => guard.canActivate(context)).rejects.toThrowError(
      ForbiddenException,
    );
  });

  it('should throw an Unauthorized exception if the caller is not authenticated', async () => {
    const context = createContext({ threadId: thread.id }, undefined);

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
    threadService.findOne.mockResolvedValue(null);
    const context = createContext({ threadId: thread.id }, user);

    await expect(() => guard.canActivate(context)).rejects.toThrowError(
      BadRequestException,
    );
  });
});

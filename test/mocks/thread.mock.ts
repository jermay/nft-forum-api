import { createMock } from '@golevelup/nestjs-testing';
import { faker } from '@faker-js/faker';
import { Thread } from '../../src/thread/entities/thread.entity';
import { Post } from '../../src/post/entities/post.entity';
import { mockId } from './utils';
import { CreateThreadDto } from '../../src/thread/dto/create-thread.dto';
import { CreatePostDto } from '../../src/post/dto/create-post.dto';
import { getCreatePostDto } from '../factories/post.factory';

export function mockPost(customValues?: Partial<CreatePostDto>) {
  return createMock<Post>({
    id: mockId(),
    ...getCreatePostDto(customValues),
  });
}

export function mockPostModel() {
  return createMock<typeof Post>({
    create: async (vals: any) => createMock<Post>(vals),
    update: async () => [1],
  });
}

export function mockThread(customValues?: Partial<CreateThreadDto>) {
  const id = mockId();
  return createMock<Thread>({
    id,
    title: customValues?.title || faker.lorem.words(),
    comments: [mockPost({ ...customValues, threadId: id })],
    save: async () => this,
  });
}

export function mockThreadModel(toFind: Thread) {
  return createMock<typeof Thread>({
    create: async (vals: any) =>
      createMock<Thread>({ ...vals, save: async () => this }),
    findByPk: async () => toFind,
    findOne: async () => toFind,
    update: async () => [1],
  });
}

export function getCreateThreadDto(extractFrom?: Thread): CreateThreadDto {
  const thread = extractFrom || mockThread();
  const post = thread.comments[0];
  delete post.threadId;
  return {
    title: thread.title,
    ...post,
  };
}

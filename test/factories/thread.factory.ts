import { faker } from '@faker-js/faker';
import { CreateThreadDto } from '../../src/thread/dto/create-thread.dto';
import { Thread } from '../../src/thread/entities/thread.entity';
import { ThreadService } from '../../src/thread/thread.service';
import { User } from '../../src/user/user.entity';
import { getCreatePostDto } from './post.factory';

export function getCreateThreadDto(
  vals?: Partial<CreateThreadDto>,
): CreateThreadDto {
  return {
    title: vals?.title || faker.lorem.words(),
    ...getCreatePostDto(vals),
  };
}

export function getThreadDtoWithUser(
  user?: User,
  vals?: Partial<CreateThreadDto>,
) {
  const dto = getCreateThreadDto(vals);
  if (user) dto.author = user.username;
  return dto;
}

export interface ThreadFactoryCreate {
  dto: CreateThreadDto;
  thread: Thread;
}

export class ThreadFactory {
  constructor(private service: ThreadService) {}

  async create(vals?: Partial<CreateThreadDto>): Promise<ThreadFactoryCreate> {
    const dto = getCreateThreadDto(vals);
    const thread = await this.service.create(dto);
    return {
      dto,
      thread,
    };
  }

  async createWithUser(
    user: User,
    vals?: Partial<CreateThreadDto>,
  ): Promise<ThreadFactoryCreate> {
    const dto = getThreadDtoWithUser(user, vals);
    return this.create(dto);
  }

  async bulkCreate(
    n: number,
    user: User,
    vals?: Partial<CreateThreadDto[]>,
  ): Promise<ThreadFactoryCreate[]> {
    const threads: ThreadFactoryCreate[] = [];
    for (let i = 0; i < n; i += 1) {
      const dto =
        vals && vals.length > i ? vals[i] : getThreadDtoWithUser(user);
      const newThread = await this.create(dto);
      threads.push(newThread);
    }
    return threads;
  }
}

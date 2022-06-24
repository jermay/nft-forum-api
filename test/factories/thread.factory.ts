import { faker } from '@faker-js/faker';
import { CreateThreadDto } from '../../src/thread/dto/create-thread.dto';
import { ThreadService } from '../../src/thread/thread.service';
import { User } from '../../src/user/user.entity';
import { getCreatePostDto } from './post.factory';

export function getCreateThreadDto(
  vals?: Partial<CreateThreadDto>,
): CreateThreadDto {
  return {
    title: vals?.title || faker.lorem.words(),
    post: vals?.post || getCreatePostDto(),
  };
}

export function getThreadDtoWithUser(
  user?: User,
  vals?: Partial<CreateThreadDto>,
) {
  const dto = getCreateThreadDto(vals);
  if (user) dto.post.author = user.username;
  return dto;
}

export class ThreadFactory {
  constructor(private service: ThreadService) {}

  async create(user: User, vals?: Partial<CreateThreadDto>) {
    const dto = getThreadDtoWithUser(user, vals);
    const thread = await this.service.create(dto);
    return {
      dto,
      thread,
    };
  }
}

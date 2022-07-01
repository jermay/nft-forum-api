import { faker } from '@faker-js/faker';
import { CreatePostDto } from '../../src/post/dto/create-post.dto';
import { PostService } from '../../src/post/post.service';
import { Thread } from '../../src/thread/entities/thread.entity';
import { User } from '../../src/user/user.entity';
import { mockId } from '../mocks/utils';

export function getCreatePostDto(
  customValues?: Partial<CreatePostDto>,
): CreatePostDto {
  return {
    threadId: customValues?.threadId || mockId(),
    author: customValues?.author || faker.name.firstName(),
    content: customValues?.content || faker.lorem.paragraph(),
  };
}

export function getCreatePostDtoWithUser(user: User): CreatePostDto {
  return getCreatePostDto({ author: user.username });
}

export class PostFactory {
  constructor(private service: PostService) {}

  createWithUser(user: User, thread: Thread) {
    const dto = getCreatePostDto({
      threadId: thread.id,
      author: user.username,
    });
    return this.service.create(dto);
  }
}

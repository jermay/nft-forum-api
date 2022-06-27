import { faker } from '@faker-js/faker';
import { CreatePostDto } from '../../src/post/dto/create-post.dto';

export function getCreatePostDto(
  customValues?: Partial<CreatePostDto>,
): CreatePostDto {
  return {
    author: customValues?.author || faker.name.firstName(),
    content: customValues?.content || faker.lorem.paragraph(),
  };
}

export class PostFactory {}

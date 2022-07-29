import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/UserDto';
import { Post } from '../entities/post.entity';

export class PostDto {
  constructor(post: Post) {
    this.id = post.id;
    this.threadId = post.threadId;
    this.author = post.author;
    this.Author = new UserDto(post.Author);
    this.content = post.content;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  threadId: number;

  @ApiProperty()
  author: string;

  @ApiProperty()
  Author: UserDto;

  @ApiProperty()
  content: string;
}

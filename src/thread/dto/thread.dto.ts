import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PostDto } from '../../post/dto/post.dto';
import { Thread } from '../entities/thread.entity';

export class ThreadDto {
  constructor(thread: Thread) {
    this.id = thread.id;
    this.title = thread.title;
    this.postId = thread.postId;
    this.comments = thread.comments.map((comment) => new PostDto(comment));
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  postId: number;

  @ApiProperty({ type: PostDto, isArray: true })
  comments: PostDto[];
}

export class ThreadHeaderDto extends OmitType(ThreadDto, ['comments']) {}

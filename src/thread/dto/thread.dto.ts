import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PostDto } from '../../post/dto/post.dto';

export class ThreadDto {
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

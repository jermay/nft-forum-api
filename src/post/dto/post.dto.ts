import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  threadId: number;

  @ApiProperty()
  author: string;

  @ApiProperty()
  content: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, ValidateNested } from 'class-validator';
import { CreatePostDto } from '../../post/dto/create-post.dto';

export class CreateThreadDto {
  @ApiProperty()
  @MaxLength(255)
  title: string;

  @ApiProperty()
  @ValidateNested()
  post: CreatePostDto;
}

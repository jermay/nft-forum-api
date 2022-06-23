import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsString()
  content: string;
}

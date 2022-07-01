import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNumber()
  threadId: number;

  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class CreatePostRequestDto extends PickType(CreatePostDto, [
  'content',
]) {}

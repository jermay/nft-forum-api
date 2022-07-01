import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateThreadDto {
  @ApiProperty()
  @MaxLength(255)
  title: string;

  @ApiProperty()
  @MaxLength(20)
  author: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class CreateThreadRquestDto extends OmitType(CreateThreadDto, [
  'author',
]) {}

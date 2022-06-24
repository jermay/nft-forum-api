import { ApiProperty } from '@nestjs/swagger';
import { Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @Length(3, 20)
  username: string;

  @ApiProperty()
  @MinLength(8)
  password: string;
}

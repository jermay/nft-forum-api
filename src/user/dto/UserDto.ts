import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserDto {
  constructor(user: User) {
    this.username = user.username;
  }

  @ApiProperty()
  username: string;
}

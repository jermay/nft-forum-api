import { ApiProperty } from '@nestjs/swagger';
import { AuthToken } from '../../auth/auth.token';
import { User } from '../user.entity';

export class UserDto {
  constructor(user: User) {
    this.username = user.username;
    this.avatarUrl = user.avatarUrl;
  }

  static fromToken(token: AuthToken): UserDto {
    return {
      username: token.sub,
      avatarUrl: token.avatar,
    };
  }

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatarUrl: string;
}

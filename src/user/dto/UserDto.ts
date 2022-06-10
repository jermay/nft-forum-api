import { User } from '../user.entity';

export class UserDto {
  constructor(user: User) {
    this.username = user.username;
  }

  username: string;
}

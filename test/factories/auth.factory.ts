import { AuthService } from '../../src/auth/auth.service';
import { CreateUserDto } from '../../src/user/dto/CreateUser.dto';
import { UserFactory } from './user.factory';

export class AuthFactory {
  constructor(
    private authService: AuthService,
    private userFactory: UserFactory,
  ) {}

  async resisterTestUser(vals?: Partial<CreateUserDto>) {
    const { user, dto } = await this.userFactory.create(vals);
    const authToken = this.authService.login(user);
    return {
      user,
      dto,
      authToken,
    };
  }
}

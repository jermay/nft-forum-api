import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../../src/user/dto/CreateUser.dto';
import { User } from '../../src/user/user.entity';
import { UserService } from '../../src/user/user.service';

export class UserFactory {
  constructor(private service: UserService) {}

  getCreateDto(vals?: Partial<CreateUserDto>): CreateUserDto {
    return {
      username: vals?.username || faker.name.firstName(),
      password: vals?.password || faker.internet.password(),
    };
  }

  async create(
    vals?: Partial<CreateUserDto>,
  ): Promise<{ user: User; dto: CreateUserDto }> {
    const dto = this.getCreateDto(vals);
    const user = await this.service.register(dto);
    return {
      user,
      dto,
    };
  }
}

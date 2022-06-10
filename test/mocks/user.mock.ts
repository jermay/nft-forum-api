import { createMock } from '@golevelup/nestjs-testing';
import { faker } from '@faker-js/faker';
import { User } from '../../src/user/user.entity';
import { EncryptionService } from '../../src/encryption/encryption.service';
import { UserService } from '../../src/user/user.service';

export function mockUser(customValues?: Partial<User>) {
  return createMock<User>({
    username: faker.name.firstName(),
    ...customValues,
  });
}

export async function mockUserWithPassword(
  encryptionService: EncryptionService,
  customValues?: Partial<User>,
) {
  const password = customValues?.password || faker.internet.password();
  const hashPassword = await encryptionService.hashPassword(password);
  const user = mockUser({ password: hashPassword });
  return {
    user,
    password,
  };
}

export async function mockUserService(encryptionService: EncryptionService) {
  const { user, password } = await mockUserWithPassword(encryptionService);
  const service = createMock<UserService>();
  service.findOne.mockResolvedValue(user as User);
  service.register.mockResolvedValue(user as User);
  return {
    user,
    password,
    service,
  };
}

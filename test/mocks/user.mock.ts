import { createMock } from '@golevelup/nestjs-testing';
import { faker } from '@faker-js/faker';
import { User } from '../../src/user/user.entity';
import { EncryptionService } from '../../src/encryption/encryption.service';
import { UserService } from '../../src/user/user.service';
import { AuthToken } from '../../src/auth/auth.token';

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

export function mockUserAuthToken(vals?: Partial<AuthToken>): AuthToken {
  const now = Date.now() / 1000;
  return {
    sub: vals?.sub || faker.name.firstName(),
    avatar: faker.internet.url(),
    iat: now,
    exp: now + 3600,
  };
}

export function mockAuthTokenFromUser(user: User) {
  return mockUserAuthToken({ sub: user.username });
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

import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import { EncryptionService } from '../encryption/encryption.service';
import { User } from './user.entity';
import { UserService } from './user.service';
import { mockUser } from '../../test/mocks/user.mock';
import { CreateUserDto } from './dto/CreateUser.dto';
import { faker } from '@faker-js/faker';

describe('UserService', () => {
  let service: UserService;
  let encryptionService: EncryptionService;
  let userModelMock: DeepMocked<typeof User>;
  let user: DeepMocked<User>;

  beforeEach(async () => {
    user = mockUser();
    userModelMock = createMock<typeof User>({
      create: async (values) => mockUser(values),
      findOne: async () => user,
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        { provide: getModelToken(User), useValue: userModelMock },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user', async () => {
    const result = await service.findOne(user.username);
    expect(result).toEqual(user);
    expect(userModelMock.findOne).toHaveBeenCalled();
  });

  it('shoud register a new user', async () => {
    const userDetails: CreateUserDto = {
      username: faker.name.firstName(),
      password: faker.internet.password(),
    };
    const result = await service.register(userDetails);
    expect(result.username).toEqual(userDetails.username);
    expect(
      await encryptionService.comparePassword(
        userDetails.password,
        result.password,
      ),
    ).toEqual(true);
    expect(userModelMock.create).toHaveBeenCalled();
  });
});

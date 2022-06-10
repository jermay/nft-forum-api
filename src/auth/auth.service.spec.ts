import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import { EncryptionService } from '../encryption/encryption.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { mockUserService } from '../../test/mocks/user.mock';
import { User } from '../user/user.entity';

describe('AuthService', () => {
  let module: TestingModule;
  let service: AuthService;
  let encryptionService: EncryptionService;
  let jwtServiceMock: DeepMocked<JwtService>;
  let userServiceMock: DeepMocked<UserService>;
  let user: DeepMocked<User>;
  let password: string;

  beforeEach(async () => {
    encryptionService = new EncryptionService();
    ({
      service: userServiceMock,
      user,
      password,
    } = await mockUserService(encryptionService));
    jwtServiceMock = createMock<JwtService>();
    module = await Test.createTestingModule({
      providers: [
        { provide: EncryptionService, useValue: encryptionService },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: UserService, useValue: userServiceMock },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate user', () => {
    it('should return the User for a valid username and password', async () => {
      const result = await service.validateUser(user.username, password);
      expect(result).toEqual(user);
    });

    it('should return null if the user is not found', async () => {
      userServiceMock.findOne.mockResolvedValue(null);
      const result = await service.validateUser('invalid', password);
      expect(result).toEqual(null);
    });

    it('should return null if the password does not match', async () => {
      const result = await service.validateUser(user.username, 'invalid');
      expect(result).toEqual(null);
    });
  });

  describe('login', () => {
    it('should return JWT token', () => {
      const testToken = 'testJwtToken';
      jwtServiceMock.sign.mockReturnValue(testToken);
      const token = service.login(user);

      expect(token).toEqual(testToken);
      expect(jwtServiceMock.sign).toHaveBeenCalled();
    });
  });
});

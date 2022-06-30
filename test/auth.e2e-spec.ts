import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthToken } from '../src/auth/auth.token';
import { LoginResponseDto } from '../src/auth/dto/LoginResponse.dto';
import { CreateUserDto } from '../src/user/dto/CreateUser.dto';
import { UserService } from '../src/user/user.service';
import { UserFactory } from './factories/user.factory';
import { clearDatabase, getTestApplication } from './mocks/utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let module: TestingModule;

  beforeAll(async () => {
    ({ app, module, server } = await getTestApplication());
  });

  afterEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    await clearDatabase(app);
    await app.close();
  });

  const postRegister = (body: CreateUserDto) => {
    return request(server).post('/auth/register').send(body);
  };

  const mockCreateUserDto = (vals?: Partial<CreateUserDto>): CreateUserDto => ({
    username: vals?.username || faker.name.firstName(),
    password: vals?.password || faker.internet.password(),
  });

  const expectJwtToken = (accessToken: string, user: CreateUserDto) => {
    const jwtService = module.get<JwtService>(JwtService);
    expect(accessToken).toEqual(expect.any(String));
    const claims = jwtService.decode(accessToken) as AuthToken;
    expect(claims.sub).toEqual(user.username);
    const hourInSec = 60 * 60;
    expect(claims.exp - claims.iat).toEqual(hourInSec);
  };

  describe('/auth/register POST', () => {
    it('should create a new user', async () => {
      const dto = mockCreateUserDto();
      const { status, body } = await postRegister(dto);
      expect(status).toEqual(201);

      const { accessToken, user } = body as LoginResponseDto;
      expect(user.username).toEqual(dto.username);
      expectJwtToken(accessToken, dto);
    });

    it('should respond with status 400 if the password is less than 8 chars', async () => {
      const args = mockCreateUserDto({ password: '12345' });
      const { status, text } = await postRegister(args);
      expect(status).toEqual(400);
      expect(text).toMatch(
        /password must be longer than or equal to 8 characters/i,
      );
    });
  });

  describe('/auth/login POST', () => {
    let userFactory: UserFactory;
    beforeEach(() => {
      const userService = module.get<UserService>(UserService);
      userFactory = new UserFactory(userService);
    });

    const postLogin = (dto: CreateUserDto) => {
      return request(server).post('/auth/login').send(dto);
    };

    it('should log in an existing user with the correct password', async () => {
      const { dto } = await userFactory.create();
      const { status, body } = await postLogin(dto);
      expect(status).toEqual(201);

      const { accessToken, user } = body as LoginResponseDto;
      expectJwtToken(accessToken, dto);
      expect(user.username).toEqual(dto.username);
    });

    it('should respond status 401 for an existing user with the wrong password', async () => {
      const { dto } = await userFactory.create();
      const { status, text } = await postLogin({
        username: dto.username,
        password: 'invalid',
      });
      expect(status).toEqual(401);
      expect(text).toMatch(/invalid username or password/i);
    });

    it('should respond status 401 for an invalid username', async () => {
      const { dto } = await userFactory.create();
      const { status, text } = await postLogin({
        username: 'invalid',
        password: dto.password,
      });
      expect(status).toEqual(401);
      expect(text).toMatch(/invalid username or password/i);
    });
  });
});

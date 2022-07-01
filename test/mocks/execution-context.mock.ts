import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { User } from '../../src/user/user.entity';
import { mockAuthTokenFromUser } from './user.mock';

export function mockAuthHeader(token: string) {
  return { authorization: `bearer ${token}` };
}

export function mockExcutionContext(req: {
  params?: Record<string, string | number>;
  body?: Record<string, any>;
  headers?: Record<string, string | number>;
  user?: User;
}): ExecutionContext {
  return createMock<ExecutionContext>({
    switchToHttp: () =>
      createMock<HttpArgumentsHost>({
        getRequest: () => ({
          params: req.params || {},
          body: req.body || {},
          headers: req.headers || {},
          user: req.user ? mockAuthTokenFromUser(req.user) : undefined,
        }),
      }),
  });
}

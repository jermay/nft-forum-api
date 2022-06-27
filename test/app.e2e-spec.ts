import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getTestApplication } from './mocks/utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    ({ app, server } = await getTestApplication());
  });

  it('/ (GET)', () => {
    return request(server).get('/').expect(200).expect('Hello!');
  });

  afterAll(async () => {
    await app.close();
  });
});

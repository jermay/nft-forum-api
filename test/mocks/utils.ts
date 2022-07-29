import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { ApiConfigService } from '../../src/config/ApiConfig.service';
import { bootstrapGlobals } from '../../src/config/bootstrap.config';
import { Post } from '../../src/post/entities/post.entity';
import { Thread } from '../../src/thread/entities/thread.entity';
import { User } from '../../src/user/user.entity';

export async function getTestApplication() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  bootstrapGlobals(app);
  await app.init();

  return {
    app,
    module,
    server: app.getHttpServer(),
  };
}

export async function clearDatabase(app: INestApplication) {
  const env = app.get<ApiConfigService>(ApiConfigService);
  if (env.NODE_ENV !== 'test')
    throw new Error('Attempting to clear database outside of test environment');

  try {
    await User.destroy({ where: {} });
    await Post.truncate({ cascade: true });
    await Thread.destroy({ where: {} });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export function mockId(vals?: { id?: number }) {
  return vals?.id || faker.datatype.number(10000);
}

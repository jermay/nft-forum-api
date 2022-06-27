import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  bootstrapGlobals,
  bootstrapNotForTest,
} from './config/bootstrap.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  bootstrapNotForTest(app);
  bootstrapGlobals(app);

  await app.listen(3001);
}
bootstrap();

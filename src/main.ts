import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ApiConfigService } from './config/ApiConfig.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ApiConfigService);
  app.use(
    session({
      secret: configService.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  // app.enableCors({
  //   methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'HEAD'],
  //   allowedHeaders: ['content-type'],
  //   preflightContinue: true,
  // });

  await app.listen(3001);
}
bootstrap();

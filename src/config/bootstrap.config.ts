import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiConfigService } from './ApiConfig.service';

export function bootstrapNotForTest(app: INestApplication) {
  const env = app.get<ApiConfigService>(ApiConfigService);
  if (env.NODE_ENV === 'test') return;

  const config = new DocumentBuilder()
    .setTitle('NFT Forum API')
    .setDescription('API for the NFT forum demo app')
    .setVersion('1.0')
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

export function bootstrapGlobals(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
}

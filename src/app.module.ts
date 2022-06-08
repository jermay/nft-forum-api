import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigModule } from './config/ApiConfig.module';
import { ApiConfigService } from './config/ApiConfig.service';
import { EnvironmentVars } from './config/environmentVars';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApiConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVars>) => {
        // TODO: figure out how to inject without getting no provider error
        const config = new ApiConfigService(configService);
        return {
          dialect: config.DATABASE_DIALECT,
          host: config.DATABASE_HOST,
          port: config.DATABASE_PORT,
          username: config.DATABASE_USERNAME,
          password: config.DATABASE_PASSWORD,
          database: config.DATABASE_NAME,
          models: [],
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

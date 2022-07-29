import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { ApiConfigModule } from './config/ApiConfig.module';
import { ApiConfigService } from './config/ApiConfig.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { PassportModule } from '@nestjs/passport';
import { EncryptionModule } from './encryption/encryption.module';
import { ThreadModule } from './thread/thread.module';
import { Thread } from './thread/entities/thread.entity';
import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApiConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (config: ApiConfigService) => ({
        dialect: config.DATABASE_DIALECT,
        host: config.DATABASE_HOST,
        port: config.DATABASE_PORT,
        username: config.DATABASE_USERNAME,
        password: config.DATABASE_PASSWORD,
        database: config.DATABASE_NAME,
        autoLoadModels: true,
        logging: true,
        sync: { alter: true },
        models: [User, Thread, Post],
      }),
    }),
    PassportModule,
    UserModule,
    AuthModule,
    EncryptionModule,
    ThreadModule,
    PostModule,
    NftModule,
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}

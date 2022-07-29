import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApiConfigModule } from '../config/ApiConfig.module';
import { ApiConfigService } from '../config/ApiConfig.service';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { EncryptionModule } from '../encryption/encryption.module';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ApiConfigModule,
    SequelizeModule.forFeature([User]),
    EncryptionModule,
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (config: ApiConfigService) => ({
        secret: config.JWT_SECRET,
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    LocalStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

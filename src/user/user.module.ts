import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EncryptionModule } from '../encryption/encryption.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([User]), EncryptionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

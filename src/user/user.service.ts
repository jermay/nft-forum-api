import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EncryptionService } from '../encryption/encryption.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private encryptionService: EncryptionService,
  ) {}

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({ where: { username } });
  }

  async register(details: CreateUserDto) {
    const password = await this.encryptionService.hashPassword(
      details.password,
    );
    const user = await this.userModel.create({
      username: details.username,
      password,
    });
    return user;
  }
}

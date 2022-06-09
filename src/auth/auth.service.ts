import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private encryptionService: EncryptionService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(username);
    if (!user) return null;

    const match = await this.encryptionService.comparePassword(
      password,
      user.password,
    );
    if (!match) return null;

    return user;
  }

  async login(user: User) {
    return this.generateAuthToken(user);
  }

  generateAuthToken(user: User) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}

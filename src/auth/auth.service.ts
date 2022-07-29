import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { EncryptionService } from '../encryption/encryption.service';
import { UserDto } from '../user/dto/UserDto';

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

  login(user: User) {
    return this.generateAuthToken(user);
  }

  generateAuthToken(user: UserDto): string {
    const payload = {
      sub: user.username,
      avatar: user.avatarUrl,
    };
    return this.jwtService.sign(payload);
  }
}

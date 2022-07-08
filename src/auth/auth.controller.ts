import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CreateUserDto } from '../user/dto/CreateUser.dto';
import { UserDto } from '../user/dto/UserDto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/LoginResponse.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Request() req): Promise<LoginResponseDto> {
    const accessToken = await this.authService.login(req.user);
    return {
      accessToken,
      user: new UserDto(req.user),
    };
  }

  @Post('register')
  @ApiOkResponse({ type: LoginResponseDto })
  async register(@Body() body: CreateUserDto): Promise<LoginResponseDto> {
    const user = await this.userService.register(body);
    const accessToken = await this.authService.login(user);
    return {
      accessToken,
      user: new UserDto(user),
    };
  }
}

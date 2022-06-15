import {
  Body,
  Controller,
  Next,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CreateUserDto } from '../user/dto/CreateUser.dto';
import { UserDto } from '../user/dto/UserDto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/LoginResponse.dto';
import { uauthClient } from './uauth';

const {
  login: uLogin,
  callback: uCallback,
  // middleware: uMiddleware,
} = uauthClient.createExpressSessionLogin();

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<LoginResponseDto> {
    const accessToken = await this.authService.login(req.user);
    return {
      accessToken,
      user: new UserDto(req.user),
    };
  }

  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<LoginResponseDto> {
    const user = await this.userService.register(body);
    const accessToken = await this.authService.login(user);
    return {
      accessToken,
      user: new UserDto(user),
    };
  }

  @Post('/login/unstoppable')
  loginUnstoppable(@Request() req, @Response() res, @Next() next) {
    console.log('/login/unstoppable', { body: req.body });
    return uLogin(req, res, next, { username: req.body.domain });
  }

  @Post('/login/unstoppable/callback')
  async loginUnstoppableCallback(
    @Request() req,
    @Response() res,
    @Next() next,
  ) {
    console.log('/login/unstoppable/callback', { body: req.body });
    await uCallback(req, res, next);
  }
}

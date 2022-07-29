import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Put,
  Request,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiRequest } from '../auth/api-request';
import { AuthService } from '../auth/auth.service';
import { LoginResponseDto } from '../auth/dto/LoginResponse.dto';
import { NftService } from '../nft/nft.service';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';
import { UserDto } from './dto/UserDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private nftService: NftService,
    private userService: UserService,
  ) {}

  @Get()
  @ApiOkResponse({ type: UserDto })
  async getUser(@Request() req: ApiRequest): Promise<UserDto> {
    return UserDto.fromToken(req.user);
  }

  @Put('/avatar')
  @ApiOkResponse({ type: LoginResponseDto })
  async updateUserAvatar(
    @Request() req: ApiRequest,
    @Body() body: UpdateUserAvatarDto,
  ): Promise<LoginResponseDto> {
    // should this be a guard?
    const isOwner = await this.nftService.isTokenOwner(body);
    if (!isOwner) throw new ForbiddenException('not token owner');

    const updatedUser: UserDto = {
      username: req.user.sub,
      avatarUrl: body.avatarUrl,
    };
    await this.userService.update(updatedUser);

    const accessToken = this.authService.generateAuthToken(updatedUser);
    return {
      accessToken,
      user: updatedUser,
    };
  }
}

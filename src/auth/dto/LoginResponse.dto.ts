import { UserDto } from '../../user/dto/UserDto';

export class LoginResponseDto {
  user: UserDto;
  accessToken: string;
}

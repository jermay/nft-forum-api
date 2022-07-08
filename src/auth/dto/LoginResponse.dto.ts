import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/UserDto';

export class LoginResponseDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  accessToken: string;
}

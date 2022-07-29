import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { IsTokenOwnerDto } from '../../nft/dto/is-token-owner.dto';

export class UpdateUserAvatarDto extends IsTokenOwnerDto {
  @ApiProperty()
  @IsUrl()
  avatarUrl: string;
}

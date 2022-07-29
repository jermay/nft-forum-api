import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsString } from 'class-validator';
import { SignatureDto } from './signature.dto';

export class IsTokenOwnerDto extends SignatureDto {
  @ApiProperty()
  @IsEthereumAddress()
  tokenAddress: string;

  @ApiProperty()
  @IsString()
  tokenId: string;
}

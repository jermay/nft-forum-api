import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEthereumAddress, IsInt, IsString } from 'class-validator';

export class SignatureDto {
  @ApiProperty()
  @IsEthereumAddress()
  address: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  chainId: number;

  @ApiProperty()
  @IsString()
  signature: string;
}

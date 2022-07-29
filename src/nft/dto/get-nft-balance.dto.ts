import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEthereumAddress, IsInt, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { SignatureDto } from './signature.dto';

export class GetNftBalanceDto extends PaginationDto implements SignatureDto {
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

import { ApiProperty } from '@nestjs/swagger';
import { NftDto } from './nft.dto';

export class NftBalanceDto {
  @ApiProperty()
  cursor?: string | null;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  page_size?: number;

  @ApiProperty({ type: NftDto, isArray: true })
  result?: NftDto[];

  @ApiProperty()
  status?: string;

  @ApiProperty()
  total?: number;
}

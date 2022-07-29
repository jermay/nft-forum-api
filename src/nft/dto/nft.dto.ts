import { ApiProperty } from '@nestjs/swagger';
import { NFTMetadataDto } from './nft-metadata.dto';

export class NftDto {
  @ApiProperty()
  amount?: string;

  @ApiProperty()
  block_number: string;

  @ApiProperty()
  block_number_minted: string;

  @ApiProperty()
  contract_type: string;

  @ApiProperty()
  last_metadata_sync: string;

  @ApiProperty()
  last_token_uri_sync: string;

  @ApiProperty()
  metadata?: NFTMetadataDto;

  @ApiProperty()
  name: string;

  @ApiProperty()
  owner_of: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  token_address: string;

  @ApiProperty()
  token_hash: string;

  @ApiProperty()
  token_id: string;

  @ApiProperty()
  token_uri?: string;

  // @ApiProperty()
  // updated_at: string;
}

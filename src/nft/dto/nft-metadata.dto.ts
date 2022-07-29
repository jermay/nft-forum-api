import { ApiProperty } from '@nestjs/swagger';

/**
 * NFT-Metadata-Standard: https://docs.opensea.io/docs/metadata-standards
 */
export class NFTMetadataDto {
  @ApiProperty()
  animation_url?: string;

  @ApiProperty()
  attributes?: Array<any>;

  @ApiProperty()
  background_color?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  image_url?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  traits?: Array<any>;

  @ApiProperty()
  youtube_url?: string;
}

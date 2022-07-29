import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { GetNftBalanceDto } from './dto/get-nft-balance.dto';
import { IsTokenOwnerDto } from './dto/is-token-owner.dto';
import { NftBalanceDto } from './dto/nft-balance.dto';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  constructor(private service: NftService) {}

  @Public()
  @Get('balance')
  @ApiOkResponse({ type: NftBalanceDto })
  async getBalance(@Query() query: GetNftBalanceDto) {
    return this.service.getBalance(query);
  }

  @Public()
  @Get('owner')
  @ApiOkResponse({ type: Boolean })
  isTokenOwner(@Query() query: IsTokenOwnerDto) {
    return this.service.isTokenOwner(query);
  }
}

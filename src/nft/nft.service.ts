// eslint-disable-next-line @typescript-eslint/no-var-requires
const Moralis = require('moralis/node');
// import Moralis from 'moralis/node';
import { ethers } from 'ethers';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ApiConfigService } from '../config/ApiConfig.service';
import { GetNftBalanceDto } from './dto/get-nft-balance.dto';
import { NftBalanceDto } from './dto/nft-balance.dto';
import { IsTokenOwnerDto } from './dto/is-token-owner.dto';
import { Chain } from './dto/chain';

const SIGNATURE_MESSAGE = 'NFT Forum Authentication';

// test
// import { testNfts } from '../../test/data/nfts';

@Injectable()
export class NftService {
  constructor(private config: ApiConfigService) {
    Moralis.start({
      appId: this.config.MORALIS_APPID,
      serverUrl: this.config.MORALIS_URL,
      masterKey: this.config.MORALIS_MASTER_KEY,
    })
      .then(() => console.log('Moralis SDK ready'))
      .catch((e: any) => console.error('error during Morlis init:', e));
  }

  async getBalance({
    address,
    chainId,
    pageSize = 10,
    cursor = null,
    signature,
  }: GetNftBalanceDto): Promise<NftBalanceDto> {
    if (!this.verifySignedMessage(address, signature)) {
      throw new ForbiddenException('signature does not match address');
    }

    // return testNfts.ud;

    // return (
    //   testNfts[cursor] || {
    //     total: 0,
    //     page: 1,
    //     page_size: 10,
    //     cursor: null,
    //     result: [],
    //   }
    // );

    const chain = ethers.utils.hexValue(chainId) as Chain;
    const nfts = await Moralis.Web3API.account.getNFTs({
      address,
      chain,
      cursor,
      limit: pageSize,
    });
    console.log({
      nfts,
      result: nfts.result,
      address,
      chainId,
      pageSize,
      cursor,
      signature,
    });
    return {
      ...nfts,
      result: nfts.result.map((nft) => ({
        ...nft,
        metadata: nft.metadata ? JSON.parse(nft.metadata) : '',
      })),
    };
  }

  async isTokenOwner(dto: IsTokenOwnerDto): Promise<boolean> {
    if (!this.verifySignedMessage(dto.address, dto.signature)) {
      throw new ForbiddenException('signature does not match address');
    }

    const chain = ethers.utils.hexValue(+dto.chainId) as Chain;
    const options = {
      chain,
      address: dto.address,
      token_address: dto.tokenAddress,
      token_id: dto.tokenId,
    };
    const response = await Moralis.Web3API.account.getNFTsForContract(options);

    // the query will filter by token address and token id so
    // total will be zero if the token is not owned
    return response.total > 0;
  }

  verifySignedMessage(address: string, signature: string): boolean {
    if (!address || !signature) return false;
    const msgAddress = ethers.utils.verifyMessage(SIGNATURE_MESSAGE, signature);
    return msgAddress === address;
  }
}

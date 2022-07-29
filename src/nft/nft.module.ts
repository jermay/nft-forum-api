import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { ApiConfigModule } from '../config/ApiConfig.module';

@Module({
  imports: [ApiConfigModule],
  providers: [NftService],
  controllers: [NftController],
  exports: [NftService],
})
export class NftModule {}

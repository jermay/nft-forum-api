import { Test, TestingModule } from '@nestjs/testing';
import { ApiConfigModule } from '../config/ApiConfig.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Moralis = require('moralis/node');
import { NftService } from './nft.service';

jest.mock('moralis/node');

describe('NftService', () => {
  let service: NftService;

  beforeEach(async () => {
    Moralis.start.mockResolvedValue();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiConfigModule],
      providers: [NftService],
    }).compile();

    service = module.get<NftService>(NftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

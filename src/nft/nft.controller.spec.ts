import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

describe('NftController', () => {
  let controller: NftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftController],
      providers: [{ provide: NftService, useValue: createMock<NftService>() }],
    }).compile();

    controller = module.get<NftController>(NftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';

describe('ThreadController', () => {
  let controller: ThreadController;
  let threadService: DeepMocked<ThreadService>;

  beforeEach(async () => {
    threadService = createMock<ThreadService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadController],
      providers: [{ provide: ThreadService, useValue: threadService }],
    }).compile();

    controller = module.get<ThreadController>(ThreadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

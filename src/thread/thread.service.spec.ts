import { DeepMocked } from '@golevelup/nestjs-testing';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import {
  getCreateThreadDto,
  mockPostModel,
  mockThread,
  mockThreadModel,
} from '../../test/mocks/thread.mock';
import { Post } from '../post/entities/post.entity';
import { PostService } from '../post/post.service';
import { Thread } from './entities/thread.entity';
import { ThreadService } from './thread.service';

describe('ThreadService', () => {
  let thread: DeepMocked<Thread>;
  let threadModelMock: DeepMocked<typeof Thread>;
  let postModelMock: DeepMocked<typeof Post>;
  let service: ThreadService;

  beforeEach(async () => {
    thread = mockThread();
    threadModelMock = mockThreadModel(thread);
    postModelMock = mockPostModel();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(Thread), useValue: threadModelMock },
        { provide: getModelToken(Post), useValue: postModelMock },
        PostService,
        ThreadService,
      ],
    }).compile();

    service = module.get<ThreadService>(ThreadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new thread', async () => {
    const dto = getCreateThreadDto(thread);
    const result = await service.create(dto);
    expect(threadModelMock.create).toHaveBeenCalledTimes(1);
    expect(result.title).toEqual(dto.title);
    expect(result.comments).toHaveLength(1);
    expect(result.comments[0].author).toEqual(dto.author);
    expect(result.comments[0].content).toEqual(dto.content);
  });

  it('should find a thread by id', async () => {
    const result = await service.findOne(thread.id);
    expect(threadModelMock.findByPk).toHaveBeenCalledWith(thread.id, {
      include: [Post],
    });
    expect(result).toEqual(thread);
  });

  it('should find all threads', async () => {
    threadModelMock.findAll.mockResolvedValue([thread]);
    const result = await service.findAll();
    expect(threadModelMock.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([thread]);
  });

  describe('update', () => {
    it('should update a thread', async () => {
      const dto = getCreateThreadDto(thread);
      const result = await service.update(thread.id, dto);
      expect(result).toEqual(true);
      expect(thread.save).toHaveBeenCalledTimes(1);
      expect(postModelMock.update).toHaveBeenCalledTimes(1);
    });

    it('should only update the title', async () => {
      const dto = { title: thread.title };
      const result = await service.update(thread.id, dto);
      expect(result).toEqual(true);
      expect(thread.save).toHaveBeenCalledTimes(1);
      expect(postModelMock.update).toHaveBeenCalledTimes(0);
    });
  });
});

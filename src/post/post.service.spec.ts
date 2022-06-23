import { DeepMocked } from '@golevelup/nestjs-testing';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { mockPostModel } from '../../test/mocks/thread.mock';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let postModelMock: DeepMocked<typeof Post>;

  beforeEach(async () => {
    postModelMock = mockPostModel();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(Post), useValue: postModelMock },
        PostService,
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

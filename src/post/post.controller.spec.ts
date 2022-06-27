import { DeepMocked } from '@golevelup/nestjs-testing';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { mockPostModel } from '../../test/mocks/thread.mock';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;
  let postModelMock: DeepMocked<typeof Post>;

  beforeEach(async () => {
    postModelMock = mockPostModel();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: getModelToken(Post), useValue: postModelMock },
        PostService,
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

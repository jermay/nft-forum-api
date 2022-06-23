import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '../post/entities/post.entity';
import { PostService } from '../post/post.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Thread } from './entities/thread.entity';

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread) private threadModel: typeof Thread,
    private postService: PostService,
  ) {}

  async create(createThreadDto: CreateThreadDto) {
    const newThread = await this.threadModel.create({
      title: createThreadDto.title,
    });
    const post = await this.postService.create(
      newThread.id,
      createThreadDto.post,
    );
    newThread.postId = post.id;
    newThread.comments = [post];
    await newThread.save();
    return newThread;
  }

  findAll() {
    return this.threadModel.findAll();
  }

  findOne(id: number) {
    return this.threadModel.findByPk(id, { include: [Post] });
  }

  async update(id: number, updateThreadDto: UpdateThreadDto) {
    const promises: Promise<any>[] = [];
    if (updateThreadDto.title) {
      promises.push(
        this.threadModel.update(
          { title: updateThreadDto.title },
          { where: { id } },
        ),
      );
    }
    if (updateThreadDto.post) {
      promises.push(this.postService.update(id, updateThreadDto.post));
    }
    await Promise.all(promises);
    return true;
  }

  remove(id: number) {
    return this.threadModel.destroy({ where: { id } });
  }
}

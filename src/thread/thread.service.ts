import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '../post/post.entity';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Thread } from './entities/thread.entity';

@Injectable()
export class ThreadService {
  constructor(@InjectModel(Thread) private threadModel: typeof Thread) {}

  async create(createThreadDto: CreateThreadDto) {
    const newThread = await this.threadModel.create(
      {
        title: createThreadDto.title,
        comments: [
          { author: createThreadDto.author, content: createThreadDto.content },
        ],
      },
      {
        include: [Post],
      },
    );
    console.log({ newThread });
    return newThread;
  }

  findAll() {
    return this.threadModel.findAll();
  }

  findOne(id: number) {
    return this.threadModel.findByPk(id);
  }

  update(id: number, updateThreadDto: UpdateThreadDto) {
    return `This action updates a #${id} thread`;
  }

  remove(id: number) {
    return this.threadModel.destroy({ where: { id } });
  }
}

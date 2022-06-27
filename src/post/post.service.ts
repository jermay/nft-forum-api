import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post) private postModel: typeof Post) {}

  create(threadId: number, createPostDto: CreatePostDto) {
    return this.postModel.create({ threadId, ...createPostDto });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postModel.update(updatePostDto, { where: { id } });
    return true;
  }

  remove(id: number) {
    return this.postModel.destroy({ where: { id } });
  }
}
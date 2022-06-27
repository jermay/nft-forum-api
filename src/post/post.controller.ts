import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('comment')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':threadId')
  create(
    @Param('threadId') threadId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(+threadId, createPostDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}

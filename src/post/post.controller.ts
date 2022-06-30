import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostAuthorGuard } from '../guards/post-author.guard';

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

  @Patch(':postId')
  @UseGuards(PostAuthorGuard)
  update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(+postId, updatePostDto);
  }

  @Delete(':postId')
  @UseGuards(PostAuthorGuard)
  remove(@Param('postId') postId: string) {
    return this.postService.remove(+postId);
  }
}

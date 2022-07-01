import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostRequestDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostAuthorGuard } from '../guards/post-author.guard';
import { ApiRequest } from '../auth/api-request';

@Controller('comment')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':threadId')
  create(
    @Param('threadId') threadId: number,
    @Body() createPostDto: CreatePostRequestDto,
    @Request() req: ApiRequest,
  ) {
    return this.postService.create({
      threadId: +threadId,
      author: req.user.sub,
      content: createPostDto.content,
    });
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

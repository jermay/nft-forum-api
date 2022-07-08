import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostRequestDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostAuthorGuard } from '../guards/post-author.guard';
import { ApiRequest } from '../auth/api-request';
import { ApiOkResponse } from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';

@Controller('comment')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':threadId')
  @ApiOkResponse({ type: PostDto })
  create(
    @Param('threadId', ParseIntPipe) threadId: number,
    @Body() createPostDto: CreatePostRequestDto,
    @Request() req: ApiRequest,
  ) {
    return this.postService.create({
      threadId: threadId,
      author: req.user.sub,
      content: createPostDto.content,
    });
  }

  @Patch(':postId')
  @UseGuards(PostAuthorGuard)
  @ApiOkResponse({ type: Boolean })
  update(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(postId, updatePostDto);
  }

  @Delete(':postId')
  @UseGuards(PostAuthorGuard)
  @ApiOkResponse({ type: Number })
  remove(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.remove(postId);
  }
}

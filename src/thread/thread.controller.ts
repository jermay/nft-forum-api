import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ThreadService } from './thread.service';
import { CreateThreadRquestDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ApiRequest } from '../auth/api-request';
import { ThreadAuthorGuard } from '../guards/thread-author.guard';
import { ThreadDto, ThreadHeaderDto } from './dto/thread.dto';
import { Public } from '../decorators/public.decorator';

@Controller('thread')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  @ApiOkResponse({ type: ThreadDto })
  create(
    @Body() createThreadDto: CreateThreadRquestDto,
    @Request() req: ApiRequest,
  ) {
    return this.threadService.create({
      ...createThreadDto,
      author: req.user.sub,
    });
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: ThreadHeaderDto, isArray: true })
  findAll() {
    return this.threadService.findAll();
  }

  @Get(':threadId')
  @Public()
  @ApiOkResponse({ type: ThreadDto })
  async findOne(@Param('threadId', ParseIntPipe) threadId: number) {
    const thread = await this.threadService.findOne(threadId);
    return new ThreadDto(thread);
  }

  @Patch(':threadId')
  @UseGuards(ThreadAuthorGuard)
  update(
    @Param('threadId', ParseIntPipe) threadId: number,
    @Body() updateThreadDto: UpdateThreadDto,
  ) {
    return this.threadService.update(threadId, updateThreadDto);
  }

  @Delete(':threadId')
  @UseGuards(ThreadAuthorGuard)
  async remove(@Param('threadId', ParseIntPipe) threadId: number) {
    await this.threadService.remove(threadId);
  }
}

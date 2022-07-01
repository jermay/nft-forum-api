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
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ThreadService } from './thread.service';
import { CreateThreadRquestDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Thread } from './entities/thread.entity';
import { ApiRequest } from '../auth/api-request';
import { ThreadAuthorGuard } from '../guards/thread-author.guard';

@Controller('thread')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  @ApiOkResponse({ type: Thread })
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
  @ApiOkResponse({ type: Thread, isArray: true })
  findAll() {
    return this.threadService.findAll();
  }

  @Get(':threadId')
  @ApiOkResponse({ type: Thread })
  findOne(@Param('threadId') threadId: string) {
    return this.threadService.findOne(+threadId);
  }

  @Patch(':threadId')
  @UseGuards(ThreadAuthorGuard)
  update(
    @Param('threadId') threadId: string,
    @Body() updateThreadDto: UpdateThreadDto,
  ) {
    return this.threadService.update(+threadId, updateThreadDto);
  }

  @Delete(':threadId')
  @UseGuards(ThreadAuthorGuard)
  async remove(@Param('threadId') threadId: string) {
    await this.threadService.remove(+threadId);
  }
}

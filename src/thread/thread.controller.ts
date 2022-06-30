import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Thread } from './entities/thread.entity';

@Controller('thread')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  @ApiOkResponse({ type: Thread })
  create(@Body() createThreadDto: CreateThreadDto) {
    return this.threadService.create(createThreadDto);
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
  update(
    @Param('threadId') threadId: string,
    @Body() updateThreadDto: UpdateThreadDto,
  ) {
    return this.threadService.update(+threadId, updateThreadDto);
  }

  @Delete(':threadId')
  async remove(@Param('threadId') threadId: string) {
    await this.threadService.remove(+threadId);
  }
}

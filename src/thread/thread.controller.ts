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

  @Get(':id')
  @ApiOkResponse({ type: Thread })
  findOne(@Param('id') id: string) {
    return this.threadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDto) {
    return this.threadService.update(+id, updateThreadDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.threadService.remove(+id);
  }
}

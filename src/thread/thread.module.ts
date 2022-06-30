import { Module } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { ThreadController } from './thread.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Thread } from './entities/thread.entity';
import { PostModule } from '../post/post.module';

@Module({
  imports: [SequelizeModule.forFeature([Thread]), PostModule],
  controllers: [ThreadController],
  providers: [ThreadService],
  exports: [ThreadService],
})
export class ThreadModule {}

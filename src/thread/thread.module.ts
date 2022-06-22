import { Module } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { ThreadController } from './thread.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Thread } from './entities/thread.entity';

@Module({
  imports: [SequelizeModule.forFeature([Thread])],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}

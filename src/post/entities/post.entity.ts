import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Thread } from '../../thread/entities/thread.entity';
import { User } from '../../user/user.entity';

@Table
export class Post extends Model {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @ForeignKey(() => Thread)
  @Column
  threadId: number;

  @ApiProperty()
  @ForeignKey(() => User)
  @Column
  author: string;

  @ApiProperty()
  @Column(DataType.TEXT)
  content: string;

  @ApiProperty()
  @BelongsTo(() => User)
  Author: User;
}

import {
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/post.entity';

@Table
export class Thread extends Model {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @Column
  title: string;

  @ApiProperty({ type: Post, isArray: true })
  @HasMany(() => Post)
  comments: Post[];
}

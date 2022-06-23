import {
  AutoIncrement,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/entities/post.entity';

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

  @ForeignKey(() => Post)
  @ApiProperty()
  @Column
  postId: number;

  @ApiProperty({ type: Post, isArray: true })
  @HasMany(() => Post)
  comments: Post[];
}

import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Post } from '../post/entities/post.entity';

@Table
export class User extends Model {
  @PrimaryKey
  @Column
  username: string;

  @Column
  password: string;

  @Column
  avatarUrl: string;

  @HasMany(() => Post)
  posts: Post[];
}

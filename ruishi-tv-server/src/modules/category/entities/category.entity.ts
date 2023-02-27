import { VideoEntity } from './../../video/entities/video.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  cate_id: number;

  @Column({ comment: '父级id，一级id为0', default: 0 })
  pid: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '分类名称' })
  cate_name: string;

  @ManyToMany((type) => VideoEntity, (video) => video.category)
  video: VideoEntity[];

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
  })
  updateTime: Date;
}

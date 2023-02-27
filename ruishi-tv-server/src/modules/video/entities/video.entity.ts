import { PartsEntity } from './parts.entity';
import { CategoryEntity } from './../../category/entities/category.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity('video')
export class VideoEntity {
  @PrimaryGeneratedColumn()
  video_id: number;

  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  category: CategoryEntity[];

  @Column({ comment: '视频标题' })
  title: string;

  @Column({ comment: '剧情简介' })
  introduction: string;

  @Column({ comment: '其他介绍' })
  other: string;

  /**
   * 视频集数
   */
  @OneToMany(() => PartsEntity, (part) => part.video)
  parts: PartsEntity[];

  @Column({ comment: '点赞数', default: 0 })
  likes: number;

  @Column({ comment: '封面', default: 0 })
  cover: string;

  @Column({ comment: '播放量', default: 0 })
  views: number;

  @Column({ comment: '评论数', default: 0 })
  comments: number;

  @Column({ comment: '评分', default: '10' })
  score: string;

  @Column({ comment: '上映年份', nullable: true })
  release: string;

  @CreateDateColumn({ comment: '发布时间/创建视频', type: 'datetime' })
  published_at: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'datetime' })
  updated_at: Date;

  @Column({ comment: '是否删除', default: false })
  is_deleted: boolean;
}

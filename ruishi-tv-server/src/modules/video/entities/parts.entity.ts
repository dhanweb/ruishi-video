import { DanmuEntity } from './../../danmu/entities/danmu.entity';
import { VideoEntity } from './video.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('parts')
export class PartsEntity {
  @PrimaryGeneratedColumn()
  part_id: number;

  @ManyToOne(() => VideoEntity, (video) => video.parts)
  @JoinColumn({ name: 'video_id' })
  video: VideoEntity;

  @OneToMany(() => DanmuEntity, (danmu) => danmu.part)
  danmu: DanmuEntity[];

  @Column({ comment: '每一集的视频介绍', nullable: true })
  description: string;

  @Column({ comment: '视频时长 单位：秒', default: '0' })
  duration: string;

  @Column({ comment: '视频链接', default: '' })
  url: string;

  @Column({ comment: '视频链接2，MP4链接', default: '' })
  url2: string;

  @Column({ comment: '视频封面', default: '' })
  cover: string;

  @Column({ comment: '视频标签', nullable: true })
  tags: string;
}

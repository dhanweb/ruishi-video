import { VideoEntity } from '../../video/entities/video.entity';
import { UserEntity } from './user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('history')
export class HistoryEntity {
  @PrimaryGeneratedColumn()
  history_id: number;

  @ManyToOne(() => UserEntity, (user) => user.collect)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne(() => VideoEntity, (video) => video.video_id)
  @JoinColumn({ name: 'video_id' })
  video: VideoEntity;

  @CreateDateColumn({ type: Date })
  time: Date;

  // @Column({ type: 'datetime', comment: '' })
  // view_date: Date;

  // @Column({ type: 'datetime', comment: '观看时长' })
  // view_duration: Date;

  // @Column({ type: 'datetime', comment: '观看进度' })
  // view_progress: Date;
}

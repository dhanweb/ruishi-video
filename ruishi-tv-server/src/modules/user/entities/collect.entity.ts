import { VideoEntity } from '../../video/entities/video.entity';
import { UserEntity } from './user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('collect')
export class CollectEntity {
  @PrimaryGeneratedColumn()
  collect_id: number;

  @ManyToOne(() => UserEntity, (user) => user.collect)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne(() => VideoEntity, (video) => video.video_id)
  @JoinColumn({ name: 'video_id' })
  video: VideoEntity;
}

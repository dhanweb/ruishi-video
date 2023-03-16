import { VideoEntity } from './../../video/entities/video.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity('swiper')
export class SwiperEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  title: string;

  @OneToOne(() => VideoEntity, (video) => video.video_id)
  @JoinColumn({ name: 'video_id' })
  video: VideoEntity;
}

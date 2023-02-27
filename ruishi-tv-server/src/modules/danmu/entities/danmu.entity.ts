import { PartsEntity } from './../../video/entities/parts.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { VideoEntity } from './../../video/entities/video.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity('danmu')
export class DanmuEntity {
  @PrimaryGeneratedColumn()
  danmu_id: number;

  @Column({ comment: '弹幕出现的时间' })
  time: number;

  @Column({ comment: '弹幕内容' })
  text: string;

  @Column({ comment: '弹幕颜色', default: '#FFFFFF' })
  color: string;

  @ManyToOne(() => PartsEntity, (part) => part.danmu)
  @JoinColumn({ name: 'part_id' })
  part: PartsEntity;

  @ManyToOne(() => UserEntity, (user) => user.danmu)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

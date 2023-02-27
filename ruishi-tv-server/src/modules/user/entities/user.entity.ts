import { DanmuEntity } from './../../danmu/entities/danmu.entity';
import { CollectEntity } from './collect.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import configuration from 'config/index';

@Entity('user')
export class UserEntity {
  // 密码的秘钥
  static SECRET_KEY = configuration().user.SECRET_KEY;

  /**
   * 给密码进行加密
   * @param password 原始的密码
   * @returns string 加密后的密码
   */
  encrypPassword(password: string): string {
    return bcrypt.hashSync(password + UserEntity.SECRET_KEY, 10);
  }
  /**
   * 比较原始密码和加密后的密码
   * @param originPwd 原始密码
   * @param encrypPwd 加密后的密码
   * @returns boolean 比较之后的结果
   */
  static comparePassword(originPwd: string, encrypPwd: string): boolean {
    return bcrypt.compareSync(originPwd + this.SECRET_KEY, encrypPwd);
  }

  /**
   * 插入数据前，对密码进行加密
   */
  @BeforeInsert()
  @BeforeUpdate()
  beforeHandler() {
    this.password = this.encrypPassword(this.password);
  }

  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 10, unique: true })
  username: string;

  @Column({ length: 100 })
  @Exclude()
  password: string;

  @Column({ comment: '邮箱', unique: true })
  email: string;

  @Column({
    comment: '头像的地址',
    default:
      'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png',
  })
  avatar: string;

  @OneToMany(() => CollectEntity, (collect) => collect.user)
  collect: CollectEntity[];

  @OneToMany(() => DanmuEntity, (danmu) => danmu.user)
  danmu: DanmuEntity[];

  @Column({ default: false, comment: '邮箱是否已经通过校验' })
  @Exclude()
  valiteEmail: boolean;

  @Column({
    type: 'datetime',
    comment: '上次登录时间',
    nullable: true,
  })
  lastLoginTime: Date;

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
  })
  @Exclude()
  createTime: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
  })
  @Exclude()
  updateTime: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import configuration from 'config/index';

@Entity('admin')
export class AdminEntity {
  // 密码的秘钥
  static SECRET_KEY = configuration().user.SECRET_KEY;

  /**
   * 给密码进行加密
   * @param password 原始的密码
   * @returns string 加密后的密码
   */
  encrypPassword(password: string): string {
    return bcrypt.hashSync(password + AdminEntity.SECRET_KEY, 10);
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
  beforeHandler() {
    this.password = this.encrypPassword(this.password);
  }

  @PrimaryGeneratedColumn()
  admin_id: number;

  @Column({ comment: '管理员名' })
  username: string;

  @Column({ comment: '管理员密码' })
  password: string;

  @CreateDateColumn({ comment: '创建日期', type: 'datetime' })
  createTime: Date;

  @UpdateDateColumn({ comment: '创建日期', type: 'datetime' })
  updateTime: Date;
}

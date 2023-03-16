import { VideoEntity } from './../video/entities/video.entity';
import { HistoryEntity } from './entities/history.entitiy';
import { CollectEntity } from './entities/collect.entity';
import { PageDto, OrderDto } from './../pagination/pagination.dto';
import { Pagination } from '../pagination/pagination.service';
import { UserEntity } from './entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { rslog } from 'src/utils/rslog';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CollectEntity)
    private readonly collectRepository: Repository<CollectEntity>,
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;
    const existUserName = await this.findByUserName(username);
    if (existUserName)
      throw new HttpException('用户名已存在！', HttpStatus.BAD_REQUEST);

    const existEmail = await this.findByEmail(email);
    if (existEmail)
      throw new HttpException('邮箱已存在！', HttpStatus.BAD_REQUEST);

    const newUser = this.userRepository.create(createUserDto);

    return await this.userRepository.save(newUser);
  }

  async updateByUserId(user_id: number, updateUserDto: Partial<UserEntity>) {
    const { username, password, email, avatar } = updateUserDto;
    rslog.trace('updateUserDto', updateUserDto);
    const existUserName = await this.findByUserName(username);
    if (existUserName && existUserName.user_id != user_id)
      throw new HttpException('该用户名已存在', HttpStatus.BAD_REQUEST);

    const existEmail = await this.findByEmail(email);
    if (existEmail && existEmail.user_id != user_id)
      throw new HttpException('该邮箱已存在', HttpStatus.BAD_REQUEST);

    const newUser = this.userRepository.create(updateUserDto);
    return this.userRepository.update({ user_id }, newUser);
  }

  async resetPassword(user_id: number) {
    const existUser = await this.findByUserId(user_id);
    existUser.password = '123456';
    const newUser = this.userRepository.create(existUser);
    return this.userRepository.update({ user_id }, newUser);
  }

  /**
   * 根据用户名查找用户
   */
  async findByUserName(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  /**
   * 根据用户名查找用户
   */
  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * 根据user_id查找用户
   */
  async findByUserId(user_id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { user_id },
      select: ['user_id', 'avatar', 'email', 'lastLoginTime', 'username'],
    });
  }

  async deleteByUserId(user_id: number) {
    return this.userRepository.delete({ user_id });
  }

  /**
   * 登录方法
   * @returns
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    // 先查找用户名
    const existUserName = await this.findByUserName(username);
    if (!existUserName) {
      throw new HttpException('用户名或密码错误！', HttpStatus.BAD_REQUEST);
    }
    // 再根据查找出来的用户的密码进行对比
    const isPass = UserEntity.comparePassword(password, existUserName.password);

    if (!isPass) {
      throw new HttpException('用户名或密码错误！', HttpStatus.BAD_REQUEST);
    }
    return existUserName;
  }

  /**
   * 根据分页获取用户信息
   */
  // async findByPage(pager, order = {}) {
  //   const { keyword, pageNum, pageSize } = pager;

  //   const skip = (pageNum - 1) * pageSize;
  //   const result = await this.userRepository.findAndCount({
  //     where: [
  //       { username: Like(`%${keyword}%`) },
  //       { email: Like(`%${keyword}%`) },
  //     ],

  //     skip,
  //     take: pageSize,
  //   });
  //   const count = result[1];
  //   const totalPage = Math.ceil(count / pageSize);
  //   rslog.log('result', result[1]);
  //   return {
  //     data: result[0],
  //     count,
  //     totalPage,
  //   };
  // }

  /**
   * 根据分页获取用户信息
   */
  async findByPage(pager: PageDto, order?: OrderDto) {
    const pagintion = new Pagination();
    order = order || { user_id: 'ASC' };

    const result = await pagintion.findByKeyword<UserEntity>(
      this.userRepository,
      pager,
      ['username', 'email'],
      order,
    );

    rslog.log('findByPage', result);
    return result;
  }

  /**
   * 新增收藏
   */
  async createCollect(user_id: number, video_id: number) {
    let message = '';
    // 根据用户id和视频id查询是否存在
    const existCollect = await this.collectRepository
      .createQueryBuilder('collect')
      .where('collect.user_id = :user_id AND collect.video_id = :video_id', {
        user_id,
        video_id,
      })
      .getOne();
    if (existCollect) {
      // 存在，且调用了这个接口表示取消收藏
      await this.collectRepository.delete({
        collect_id: existCollect.collect_id,
      });
      message = '取消收藏';
    } else {
      // 不存在，表示新增收藏
      const video = await this.videoRepository.findOne({ where: { video_id } });
      const user = await this.userRepository.findOne({
        where: { user_id },
        relations: ['collect'],
      });
      const newCollect = this.collectRepository.create({ user, video });
      await this.collectRepository.save(newCollect);
      message = '收藏成功';
    }

    rslog.log('userService:createCollect-----createRes', existCollect);
    return message;
  }

  /**
   * 获取用户收藏列表
   */
  async getUserCollect(user_id: number) {
    const existCollect = await this.collectRepository
      .createQueryBuilder('collect')
      .where('collect.user_id = :user_id ', {
        user_id,
      })
      .leftJoinAndSelect('collect.video', 'video')
      .getMany();

    rslog.log('existCollect', existCollect);
    return existCollect;
  }

  async getCollectDetail(user_id: number, collect_id: number) {
    const existCollect = await this.collectRepository
      .createQueryBuilder('collect')
      .where(
        'collect.collect_id = :collect_id AND collect.user_id = :user_id ',
        {
          collect_id,
          user_id,
        },
      )
      .leftJoinAndSelect('collect.video', 'video')
      .getMany();

    rslog.log('existCollect', existCollect);
    return existCollect;
  }

  /**
   * 新增观看
   */
  async createHistory(user_id: number, video_id: number) {
    const video = await this.videoRepository.findOne({ where: { video_id } });
    const user = await this.userRepository.findOne({
      where: { user_id },
    });
    const existHistory = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.user_id = :user_id AND history.video_id = :video_id', {
        user_id,
        video_id,
      })
      .getOne();
    console.log('existHistory', existHistory);
    if (existHistory) {
      return '';
    }
    const newHistory = this.historyRepository.create({ user, video });
    return await this.historyRepository.save(newHistory);
  }

  /**
   * 获取用户观看历史
   */
  async getHistoryList(user_id: number) {
    const existHistory = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.user_id = :user_id ', {
        user_id,
      })
      .leftJoinAndSelect('history.video', 'video')
      .getMany();
    rslog.log('existHistory', existHistory);
    return existHistory;
  }

  /**
   * 删除历史
   */
  async deleteHistory(user_id: number, history_id: number) {
    // return this.historyRepository.delete({ history_id, user_id });
    const deleteRes = await this.historyRepository
      .createQueryBuilder('history')
      .delete()
      .from(HistoryEntity)
      .where('user_id = :user_id AND history_id = : history_id', {
        user_id,
        history_id,
      })
      .execute();
    return deleteRes;
  }
}

import { PartsEntity } from './../video/entities/parts.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { rslog } from 'src/utils/rslog';
import { VideoEntity } from './../video/entities/video.entity';
import { DanmuEntity } from './entities/danmu.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDanmuDto } from './dto/create-danmu.dto';
import { UpdateDanmuDto } from './dto/update-danmu.dto';
import { Repository } from 'typeorm';

@Injectable()
export class DanmuService {
  constructor(
    @InjectRepository(DanmuEntity)
    private readonly danmuRepository: Repository<DanmuEntity>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PartsEntity)
    private readonly partRepository: Repository<PartsEntity>,
  ) {}
  async create(user_id: number, createDanmuDto: CreateDanmuDto) {
    const { part_id } = createDanmuDto;
    const part = await this.partRepository.findOne({
      where: { part_id },
      relations: ['danmu'],
    });
    const user = await this.userRepository.findOne({ where: { user_id } });
    const newDanmu = this.danmuRepository.create({
      ...createDanmuDto,
      part,
      user,
    });
    const danmuRes = await this.danmuRepository.save(newDanmu);
    rslog.log('newDanmu', newDanmu);
    return danmuRes;
  }

  /**
   * 获取视频弹幕列表
   */
  async findDanmuByVid(part_id: number) {
    rslog.log('part_id', part_id);

    return await this.danmuRepository
      .createQueryBuilder('danmu')
      .where('danmu.part_id = :part_id', {
        part_id,
      })
      .getMany();
  }
}

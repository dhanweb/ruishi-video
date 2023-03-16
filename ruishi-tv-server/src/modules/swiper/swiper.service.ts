import { VideoEntity } from './../video/entities/video.entity';
import { SwiperEntity } from './entities/swiper.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSwiperDto } from './dto/create-swiper.dto';
import { UpdateSwiperDto } from './dto/update-swiper.dto';
import { Repository } from 'typeorm';

@Injectable()
export class SwiperService {
  constructor(
    @InjectRepository(SwiperEntity)
    private readonly swiperRepository: Repository<SwiperEntity>,
    @InjectRepository(VideoEntity)
    private readonly videorRepository: Repository<VideoEntity>,
  ) {}
  async create(createSwiperDto: CreateSwiperDto) {
    const existVideo = await this.videorRepository.findOne({
      where: { video_id: createSwiperDto.video_id },
    });
    const newSiwper = this.swiperRepository.create({
      ...createSwiperDto,
      video: existVideo,
    });
    return await this.swiperRepository.save(newSiwper);
  }

  async findAll() {
    return await this.swiperRepository.find({
      relations: ['video'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} swiper`;
  }

  async update(id: number, updateSwiperDto: UpdateSwiperDto) {
    const { video_id, title, url } = updateSwiperDto;
    const existVideo = await this.videorRepository.findOne({
      where: { video_id },
    });
    const newSiwper = this.swiperRepository.create({
      title,
      url,
      video: existVideo,
    });
    return await this.swiperRepository.update(id, newSiwper);
  }

  async remove(id: number) {
    return await this.swiperRepository.delete(id);
  }
}

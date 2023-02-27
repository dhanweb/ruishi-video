import { DanmuEntity } from './../danmu/entities/danmu.entity';
import { FileDto } from './../upload/dto/create-upload.dto';
import { PageDto, OrderDto } from './../pagination/pagination.dto';
import { RedisInstance } from 'src/common/redis';
import { uploadVod, getTaskDetail } from './tencent.vod';
import { join } from 'path';
import { rslog } from 'src/utils/rslog';
import { CategoryEntity } from './../category/entities/category.entity';
import { PartsEntity } from './entities/parts.entity';
import { VideoEntity } from './entities/video.entity';
import { Injectable } from '@nestjs/common';
import { CreateVideoDto, CreatePartDto } from './dto/create-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import configuration from '../../../config/index';
import { Pagination } from '../pagination/pagination.service';

const Redis = null;
let timer = null;

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectRepository(PartsEntity)
    private readonly partsRepository: Repository<PartsEntity>,
    @InjectRepository(CategoryEntity)
    private readonly catesRepository: Repository<CategoryEntity>,
    @InjectRepository(DanmuEntity)
    private readonly danmuRepository: Repository<DanmuEntity>,
  ) {}

  /**
   * 新建视频信息
   */
  async createVideoInfo(createVideoDto: CreateVideoDto) {
    const { cate_id } = createVideoDto;
    // 分类实体的多条件查询
    const cateConditions = [];
    cate_id.forEach((item) => {
      cateConditions.push({
        cate_id: item,
      });
    });

    rslog.log('cateConditions', cateConditions);

    const cateResult = await this.catesRepository.find({
      where: cateConditions,
    });
    rslog.log('cateResult', cateResult);
    const createVideo = {
      ...createVideoDto,
      category: cateResult,
    };
    rslog.log('createVideo', createVideo);
    const newVideo = this.videoRepository.create(createVideo);
    rslog.log('newVideo', newVideo);
    return this.videoRepository.save(newVideo);
  }

  /**
   * 编辑视频信息
   */
  async updateVideo(video_id: number, updateVideoDto: Partial<CreateVideoDto>) {
    const { cate_id } = updateVideoDto;

    rslog.log('updateVideoDto', updateVideoDto);
    const newVideo = await this.videoRepository.findOne({
      where: { video_id },
    });
    // 分类实体的多条件查询
    const cateConditions = [];
    cate_id.forEach((item) => {
      cateConditions.push({
        cate_id: item,
      });
    });
    const obj = {
      ...updateVideoDto,
      category: cateConditions,
    };
    const res = await this.videoRepository.save(obj);
    return res;
  }

  /**
   * 上下架视频
   */
  async upOrDownVideo(video_id: number) {
    const existVideo = await this.videoRepository.findOne({
      where: { video_id },
    });
    let is_deleted = true;
    if (existVideo.is_deleted) {
      is_deleted = false;
    }
    return await this.videoRepository.update({ video_id }, { is_deleted });
  }

  /**
   * 获取视频详情
   */
  async getVideoDetail(video_id: number) {
    return this.videoRepository.findOne({
      relations: ['parts', 'category'],
      where: { video_id },
    });
  }

  async getPartDetail(part_id: number) {
    return this.partsRepository.find({
      relations: ['video'],
      where: { part_id },
    });
  }

  /**
   * 新建视频集数、每一集内容
   */
  async createPart(createPartDto: CreatePartDto, file?: FileDto) {
    const { video_id } = createPartDto;
    const video = await this.videoRepository.findOne({ where: { video_id } });
    const newPart = this.partsRepository.create(createPartDto);
    newPart.video = video;
    const result = await this.partsRepository.save(newPart);

    // 上传视频
    this.uploadVideoToVOD(result.part_id, file.path);

    return result;
  }

  /**
   * 删除part
   */
  async deletePart(part_id: number) {
    const existDanmu = await this.danmuRepository
      .createQueryBuilder('collect')
      .where('part_id = :part_id', { part_id })
      .getMany();

    await this.danmuRepository.remove(existDanmu);
    return await this.partsRepository.delete({ part_id });
  }

  /**
   * 编辑每一集内容
   */
  async editPart(createPartDto: CreatePartDto, file?: FileDto) {
    const { video_id } = createPartDto;
    const video = await this.videoRepository.findOne({ where: { video_id } });
    const newPart = this.partsRepository.create(createPartDto);
    newPart.video = video;
    const result = await this.partsRepository.save(newPart);

    // 上传视频
    this.uploadVideoToVOD(result.part_id, file.path);

    return result;
  }

  /**
   * 上传视频到云点播
   */
  async uploadVideoToVOD(part_id: number, filePath: string) {
    // 上传成功后，返回转码的任务id
    const result = await uploadVod(part_id, filePath);
    // 轮询转码结果
    timer = setInterval(async () => {
      const TaskResult = await getTaskDetail(result.TaskId);
      rslog.trace('转码结果------', JSON.stringify(TaskResult));
      if (TaskResult.Status == 'FINISH') {
        const url =
          TaskResult.ProcedureTask.MediaProcessResultSet[0].TranscodeTask.Output
            .Url;
        const duration =
          TaskResult.ProcedureTask.MediaProcessResultSet[0].TranscodeTask.Output
            .Duration;
        const cover =
          TaskResult.ProcedureTask.MediaProcessResultSet[1].CoverBySnapshotTask
            .Output.CoverUrl;
        rslog.log('结果：', url, '-----------', duration, '=========', cover);

        await this.partsRepository
          .createQueryBuilder('parts')
          .update(PartsEntity)
          .set({ url, duration, cover })
          .where('part_id = :part_id', { part_id })
          .execute();
        clearInterval(timer);
        timer = null;
      }
    }, 3000);
  }

  /**
   * 分页/搜索获取视频结果
   */
  async getVideoByPage(pager: PageDto, order?: OrderDto) {
    const pagintion = new Pagination();
    const result = await pagintion.findByKeyword<VideoEntity>(
      this.videoRepository,
      pager,
      ['title', 'introduction', 'other'],
      order,
      ['parts', 'category'],
    );
    rslog.log('videoService: getVideoByPage--result', result);
    return result;
  }
}

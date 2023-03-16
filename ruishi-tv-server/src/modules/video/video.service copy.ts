import { randomUUID, createHash } from 'crypto';
import { FindByCategoryDto } from './dto/find-video.dto';
import { DanmuEntity } from './../danmu/entities/danmu.entity';
import { FileDto } from './../upload/dto/create-upload.dto';
import { PageDto, OrderDto } from './../pagination/pagination.dto';
import { uploadVod, getTaskDetail, getPullEventsVod } from './tencent.vod';
import { rslog } from 'src/utils/rslog';
import { CategoryEntity } from './../category/entities/category.entity';
import { PartsEntity } from './entities/parts.entity';
import { VideoEntity } from './entities/video.entity';
import { Injectable } from '@nestjs/common';
import {
  CreateVideoDto,
  CreatePartDto,
  IProgress,
  IEventSet,
} from './dto/create-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import configuration from '../../../config/index';
import { Pagination } from '../pagination/pagination.service';
import { RedisInstance } from '../../common/redis';
import type { Redis } from 'ioredis';

const config = configuration();
let redis = {} as Redis;
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
  ) {
    RedisInstance.initRedis().then((res) => {
      redis = res;
    });
  }

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
    rslog.log('getVideoDetail2');
    // 已完成的
    const existVideo = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.parts', 'parts')
      .where('video.video_id = :video_id', { video_id })
      .getOne();

    const newVideo = existVideo.parts.map(async (item) => {
      // url2为空，表示上传未完成，
      if (item.url2 === '') {
        rslog.log('未完成');
        // 未上传完成，则向redis取进度
        item['progress'] = await redis.get('' + item.part_id);
      }
      return item;
    });
    const parts = await Promise.all(newVideo);
    rslog.log('parts', parts);
    const video = {
      ...existVideo,
      parts,
    };
    return video;
  }

  /**
   * 每集的详情
   */
  async getPartDetail(part_id: number) {
    return this.partsRepository.find({
      relations: ['video'],
      where: { part_id },
    });
  }

  /**
   * 新建视频集数、每一集内容
   */
  async createPart(createPartDto: CreatePartDto) {
    const { video_id } = createPartDto;
    const video = await this.videoRepository.findOne({ where: { video_id } });
    const newPart = this.partsRepository.create(createPartDto);
    newPart.video = video;
    const result = await this.partsRepository.save(newPart);
    rslog.log('createPart:result', result);
    // 上传视频
    // this.uploadVideoToVOD(result.part_id, file.path);
    this.getPullEvents(result.part_id);
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
  async editPart(
    part_id: number,
    createPartDto: Partial<CreatePartDto>,
    file?: FileDto,
  ) {
    const { video_id } = createPartDto;
    const video = await this.videoRepository.findOne({ where: { video_id } });
    const newPart = this.partsRepository.create(createPartDto);
    newPart.video = video;
    console.log('newPart', newPart);
    const result = await this.partsRepository.update(part_id, newPart);

    if (file) {
      await this.partsRepository.update(part_id, { url: '' });
      console.log('上传');
      // 上传视频
      this.uploadVideoToVOD(part_id, file.path);
    }
    return result;
  }

  /**
   *
   * 拉取事件列表，轮询获取上传、转码、封面截取的结果
   */
  async getPullEvents(part_id: number) {
    const partid = part_id + '';
    rslog.log('getPullEvents');
    let updateData = {} as Partial<PartsEntity>;
    // 开始轮询
    let timer = setInterval(async () => {
      const { EventSet } = await getPullEventsVod();
      rslog.log('EventSet', EventSet);
      for (let i = 0; i < EventSet.length; i++) {
        const item = EventSet[i];
        // rslog.log()
        // 解构上传文件相关的参数
        const Name = item.FileUploadEvent?.MediaBasicInfo.Name;

        // 解构转码结果的参数
        const FileName = item?.ProcedureStateChangeEvent?.FileName;
        const Status =
          item?.ProcedureStateChangeEvent?.MediaProcessResultSet[0]
            .TranscodeTask.Status;

        // 解构封面截取相关的参数
        const CoverStatus =
          item.ProcedureStateChangeEvent?.MediaProcessResultSet[1]
            .CoverBySnapshotTask.Status;

        // 只有当FileName存在，才表示是上传事件
        if (Name && Name === partid) {
          const MediaUrl = item.FileUploadEvent?.MediaBasicInfo.MediaUrl;
          rslog.warn('上传完成', MediaUrl);
          updateData = {
            url2: MediaUrl,
          };
        }
        // 只有当FileName存在，才表示是转码的事件，然后获取 FileName === partid 的事件，再判断是否成功
        if (FileName && partid === FileName && Status === 'SUCCESS') {
          const Output =
            item?.ProcedureStateChangeEvent?.MediaProcessResultSet[0]
              .TranscodeTask.Output;
          const { Url, Duration } = Output;
          rslog.warn('转码完成', Url);

          // 表示转码完成
          updateData = {
            url: Url,
            duration: Duration,
          };
        }
        if (FileName && partid === FileName && CoverStatus === 'SUCCESS') {
          const cover =
            item.ProcedureStateChangeEvent?.MediaProcessResultSet[1]
              .CoverBySnapshotTask.Output.CoverUrl;
          // 表示封面截取完成
          updateData = {
            cover,
          };
          rslog.warn('封面截取完成', cover);
          // 封面是最后截取的，所以封面截取完成则表示完成了所有操作，取消轮询
          clearInterval(timer);
          timer = null;
        }
        rslog.warn('updateData', updateData);
        // updateData不为空才执行以下方法
        if (Object.values(updateData).length !== 0) {
          const partRes = await this.partsRepository.update(
            { part_id },
            updateData,
          );
          // if(partRes.raw.)
        }
      }
    }, 7000);
  }

  /**
   * 上传视频到云点播
   */
  async uploadVideoToVOD(part_id: number, filePath: string) {
    // 上传成功后，返回转码的任务id
    const result = await uploadVod(part_id, filePath);
    // 轮询转码结果
    let timer = setInterval(async () => {
      const TaskResult = await getTaskDetail(result.TaskId);
      rslog.trace('转码结果------', JSON.stringify(TaskResult));
      if (TaskResult.Status == 'FINISH') {
        const url =
          TaskResult.ProcedureTask.MediaProcessResultSet[0].TranscodeTask.Output
            .Url;
        const url2 = TaskResult.ProcedureTask.FileUrl;
        const duration =
          TaskResult.ProcedureTask.MediaProcessResultSet[0].TranscodeTask.Output
            .Duration;
        const cover =
          TaskResult.ProcedureTask.MediaProcessResultSet[1].CoverBySnapshotTask
            .Output.CoverUrl;
        rslog.log('结果：', url, '-----------', duration, '=========', cover);
        // rslog.log
        await this.partsRepository
          .createQueryBuilder('parts')
          .update(PartsEntity)
          .set({ url, duration, cover, url2 })
          .where('part_id = :part_id', { part_id })
          .execute();
        clearInterval(timer);
        timer = null;
      }
    }, 3000);
  }

  /**
   * 根据分类搜索视频
   */
  async getByCate(findByCategoryDto: FindByCategoryDto) {
    rslog.log('getByCate', findByCategoryDto);
    const { category } = findByCategoryDto;

    rslog.log('category', category);
    rslog.log('category.join(', ')', category.join(','));

    const query = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.parts', 'part')
      .innerJoin(
        '(SELECT videoVideoId FROM video_category_category WHERE categoryCateId IN (:...category) GROUP BY videoVideoId HAVING COUNT(DISTINCT categoryCateId) = :categoryCount)',
        'vc',
        'vc.videoVideoId = video.video_id',
        { category, categoryCount: category.length },
      );
    rslog.trace('query', query);

    const videos = await query.getMany();

    return videos;
  }

  /**
   * 生成防盗播放链接
   */
  async generateVideoUrl(url: string) {
    const { Time, Key } = config.file;
    // 生成当前时间
    const nowTIme = new Date().getTime();
    // 设置过期时间 并转换成16进制
    const t = (Math.round(nowTIme / 1000) + 60 * Time).toString(16);
    const urlArr = url.split('/');
    // 存储路径
    const Dir = `/${urlArr[3]}/${urlArr[4]}/`;
    // 唯一字符串
    const us = randomUUID();
    // 最终生成结果
    const md5 = createHash('md5');
    const sign = md5.update(`${Key}${Dir}${t}${us}`).digest('hex');
    // rslog.log('md5', createHash('123456'));
    // 返回播放链接
    return `${url}?t=${t}&us=${us}&sign=${sign}`;
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
  /**
   * 设置上传进度
   */
  setPartProgress(data: IProgress) {
    const { part_id, progress } = data;
    if (Number(progress) === 100) {
      // 进度等于100表示上传完成
      redis.del(part_id + '');
      return;
    }
    redis.set(part_id + '', progress);
  }
}

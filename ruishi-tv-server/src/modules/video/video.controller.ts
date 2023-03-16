import { FindByCategoryDto } from './dto/find-video.dto';
import { rslog } from 'src/utils/rslog';
import { PageDto } from './../pagination/pagination.dto';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import {
  CreateVideoDto,
  CreatePartDto,
  IProgress,
} from './dto/create-video.dto';
import { generateSignature, getPullEventsVod } from './tencent.vod';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.createVideoInfo(createVideoDto);
  }

  @Post('update/:video_id')
  updateVideo(
    @Param() param: { video_id: number },
    @Body() createVideoDto: CreateVideoDto,
  ) {
    return this.videoService.updateVideo(param.video_id, createVideoDto);
  }

  @Post('toggle/:video_id')
  toggleVideo(@Param() param: { video_id: number }) {
    return this.videoService.upOrDownVideo(param.video_id);
  }

  @Get('detail/:video_id')
  getVideoDetail(@Param() param: { video_id: number }) {
    return this.videoService.getVideoDetail(param.video_id);
  }

  @Post('part')
  createPart(@Body() part: CreatePartDto) {
    return this.videoService.createPart(part);
  }

  @Get('part/:part_id')
  getPartDetail(@Param() param: { part_id: number }) {
    return this.videoService.getPartDetail(param.part_id);
  }

  @Post('part/:part_id')
  deletePart(@Param() param: { part_id: number }) {
    return this.videoService.deletePart(param.part_id);
  }

  @Post('part/edit/:part_id')
  editPart(
    @Param() param: { part_id: number },
    @Body() body: Partial<CreatePartDto>,
  ) {
    rslog.log('editPart:contro', param);
    return this.videoService.editPart(param.part_id, body);
  }

  @Get('find')
  getByPage(@Query() pager: PageDto) {
    rslog.log('getByPage', pager);
    return this.videoService.getVideoByPage(pager, {
      video_id: pager.order || 'ASC',
    });
  }

  @Get('find/orderByTime')
  getByPageOBTime(@Body() pager: PageDto) {
    return this.videoService.getVideoByPage(pager, {
      release: pager.order || 'ASC',
    });
  }

  @Get('find/orderByScore')
  getByPageOBScore(@Body() pager: PageDto) {
    return this.videoService.getVideoByPage(pager, {
      score: pager.order || 'ASC',
    });
  }

  @Post('cate')
  findByCate(@Body() body: FindByCategoryDto) {
    return this.videoService.getByCate(body);
  }

  @Post('key')
  gennerateUrl(@Body() body: { url: string }) {
    return this.videoService.generateVideoUrl(body.url);
  }

  @Post('uploadKey')
  generateUploadKey() {
    return generateSignature();
  }

  @Post('progress')
  setProgress(@Body() body: IProgress) {
    this.videoService.setPartProgress(body);
  }

  @Post('events')
  async getPullEvents() {
    return await getPullEventsVod();
  }

  @Post('confirm')
  async confirmEvents() {
    return this.videoService.confirmEvents();
  }
}

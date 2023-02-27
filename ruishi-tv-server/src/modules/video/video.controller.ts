import { rslog } from 'src/utils/rslog';
import { PageDto } from './../pagination/pagination.dto';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto, CreatePartDto } from './dto/create-video.dto';

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

  @Post('part')
  createPart(@Body() createPartDto: CreatePartDto) {
    return this.videoService.createPart(createPartDto);
  }

  @Get('detail/:video_id')
  getVideoDetail(@Param() param: { video_id: number }) {
    return this.videoService.getVideoDetail(param.video_id);
  }

  @Get('part/:part_id')
  getPartDetail(@Param() param: { part_id: number }) {
    return this.videoService.getPartDetail(param.part_id);
  }

  @Post('part/:part_id')
  deletePart(@Param() param: { part_id: number }) {
    return this.videoService.deletePart(param.part_id);
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

  // @Post('/trans')
  // transcodingVideo(@Body() body: { fileId: string }) {
  //   return this.videoService.transcodingVideo(body.fileId);
  // }

  // @Get('task/:task_id')
  // getTaskDetail(@Param() param: { task_id: string }) {
  //   return this.videoService.getTaskDetail(param.task_id);
  // }
}

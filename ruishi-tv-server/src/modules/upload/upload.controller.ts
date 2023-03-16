import { FileDto } from './dto/create-upload.dto';
import { VideoService } from './../video/video.service';
import { CreatePartDto } from './../video/dto/create-video.dto';
import { uploadCos } from './tencent.cos';
import { rslog } from 'src/utils/rslog';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
} from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly videoService: VideoService,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadFiles(@Body() body: any, @UploadedFile() file: any) {
    rslog.log('body', body);
    return uploadCos(file.path, file.filename, body.type);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('2')
  async uploadFiles2(@Body() body: any, @UploadedFile() file: any) {
    rslog.log('body', body);
    return this.uploadService.uplods();
  }
  // @UseInterceptors(FileInterceptor('file'))
  @Post('3')
  async uploadFiles3(@Body() body: any, @UploadedFile() file: any) {
    rslog.log('body', body);
    return this.uploadService.CommitUpload();
  }

  // @UseInterceptors(FileInterceptor('file'))
  // @Post('video')
  // async uploadVideo(
  //   @Body() createPartDto: CreatePartDto,
  //   @UploadedFile() file: FileDto,
  // ) {
  //   rslog.log('createPartDto', createPartDto);
  //   rslog.log('file', file);
  //   return this.videoService.createPart(createPartDto, file);
  // }

  // @UseInterceptors(FileInterceptor('file'))
  // @Post('video/:part_id')
  // async uploadVideoAndEdit(
  //   @Param() param: { part_id: number },
  //   @Body() createPartDto: CreatePartDto,
  //   @UploadedFile() file: FileDto,
  // ) {
  //   rslog.log('uploadVideoAndEdit', createPartDto);
  //   rslog.log('file', file);
  //   return this.videoService.editPart(param.part_id, createPartDto, file);
  // }

  //   @UseInterceptors(FileInterceptor('file'))
  //   @Post('video/edit')
  //   async uploadVideoAndEdit(
  //     @Body() createPartDto: CreatePartDto,
  //     @UploadedFile() file: FileDto,
  //   ) {
  //     rslog.log('createPartDto', createPartDto);
  //     rslog.log('file', file);
  //     return this.videoService.editPart(createPartDto, file);
  //   }
}

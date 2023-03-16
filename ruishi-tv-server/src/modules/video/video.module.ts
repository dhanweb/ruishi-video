import { DanmuEntity } from './../danmu/entities/danmu.entity';
import { UploadModule } from './../upload/upload.module';
import { CategoryEntity } from './../category/entities/category.entity';
import { PartsEntity } from './entities/parts.entity';
import { VideoEntity } from './entities/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { RedisInstance } from '../../common/redis';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoEntity,
      PartsEntity,
      CategoryEntity,
      DanmuEntity,
    ]),
  ],
  controllers: [VideoController],
  providers: [VideoService, RedisInstance],
  exports: [VideoModule],
})
export class VideoModule {}

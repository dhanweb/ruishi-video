import { DanmuEntity } from './../danmu/entities/danmu.entity';
import { PartsEntity } from './../video/entities/parts.entity';
import { CategoryEntity } from './../category/entities/category.entity';
import { VideoEntity } from './../video/entities/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoService } from './../video/video.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import configuration from '../../../config/index';
import { VideoModule } from '../video/video.module';
const config = configuration();
const rootDir = join(__dirname, config.file.location);

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          // 配置存储
          destination: rootDir, // 要存储的位置
          // destination: `./public/uploads`,
          filename: (req, file, cb) => {
            // 文件名处理
            const filename = `${randomUUID()}.${file.mimetype.split('/')[1]}`;
            return cb(null, filename);
          },
        }),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      // 文件访问根路径   设置后文件访问路径变为  localhost/staitc/xxx.jpg
      serveRoot: config.file.serveRoot,
      rootPath: rootDir,
    }),
    TypeOrmModule.forFeature([
      VideoEntity,
      PartsEntity,
      CategoryEntity,
      DanmuEntity,
    ]),
    VideoModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, VideoService],
  exports: [UploadModule],
})
export class UploadModule {}

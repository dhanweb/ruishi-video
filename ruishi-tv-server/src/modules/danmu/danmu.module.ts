import { PartsEntity } from './../video/entities/parts.entity';
import { AuthModule } from './../auth/auth.module';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { VideoEntity } from './../video/entities/video.entity';
import { DanmuEntity } from './entities/danmu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DanmuService } from './danmu.service';
import { DanmuController } from './danmu.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DanmuEntity,
      VideoEntity,
      UserEntity,
      PartsEntity,
    ]),
    AuthModule,
  ],
  controllers: [DanmuController],
  providers: [DanmuService],
})
export class DanmuModule {}

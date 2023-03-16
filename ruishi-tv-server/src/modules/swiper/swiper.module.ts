import { AuthModule } from './../auth/auth.module';
import { VideoEntity } from './../video/entities/video.entity';
import { SwiperEntity } from './entities/swiper.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SwiperService } from './swiper.service';
import { SwiperController } from './swiper.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SwiperEntity, VideoEntity]), AuthModule],
  controllers: [SwiperController],
  providers: [SwiperService],
})
export class SwiperModule {}

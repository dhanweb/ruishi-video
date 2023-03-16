import { SwiperModule } from './modules/swiper/swiper.module';
import { DanmuModule } from './modules/danmu/danmu.module';
import { CategoryModule } from './modules/category/category.module';
import { UploadModule } from './modules/upload/upload.module';
import { VideoModule } from './modules/video/video.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from '../config/index';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        ({
          type: 'mysql',
          ...configService.get('db.mysql'),
        } as TypeOrmModuleOptions),
    }),
    CategoryModule,
    UserModule,
    AuthModule,
    AdminModule,
    VideoModule,
    UploadModule,
    DanmuModule,
    SwiperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

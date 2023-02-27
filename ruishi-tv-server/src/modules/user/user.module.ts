import { DanmuEntity } from './../danmu/entities/danmu.entity';
import { VideoEntity } from './../video/entities/video.entity';
import { AuthModule } from './../auth/auth.module';
import { HistoryEntity } from './entities/history.entitiy';
import { CollectEntity } from './entities/collect.entity';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CollectEntity,
      HistoryEntity,
      VideoEntity,
      DanmuEntity,
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

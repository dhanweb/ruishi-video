import { VideoEntity } from './../video/entities/video.entity';
import { HistoryEntity } from './../user/entities/history.entitiy';
import { CollectEntity } from './../user/entities/collect.entity';
import { AdminEntity } from './../admin/entities/admin.entity';
import { AdminService } from './../admin/admin.service';
import { UserService } from './../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './../user/entities/user.entity';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { PassportModule } from '@nestjs/passport';
import {
  UserLocalStrategy,
  AdminLocalStrategy,
} from './strategy/local.strategy';
import { UserJwtStrategy, AdminJwtStrategy } from './strategy/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('jwt.secretkey'),
      signOptions: { expiresIn: configService.get('jwt.expiresIn') },
    };
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AdminEntity,
      CollectEntity,
      HistoryEntity,
      VideoEntity,
    ]),
    jwtModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    AdminService,
    UserLocalStrategy,
    AdminLocalStrategy,
    UserJwtStrategy,
    AdminJwtStrategy,
  ],
  exports: [AuthModule],
})
export class AuthModule {}

import { TokenDto } from './../dto/create-token';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';

export class UserJwtStrategy extends PassportStrategy(Strategy, 'userJwt') {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt.secretkey'),
    } as StrategyOptions);
  }

  async validate(user: TokenDto) {
    const existUser = await this.authService.getUserInfo(user);

    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }
    return existUser;
  }
}

export class AdminJwtStrategy extends PassportStrategy(Strategy, 'adminJwt') {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt.secretkey'),
    } as StrategyOptions);
  }

  async validate(admin: TokenDto) {
    const existAdmin = await this.authService.getAdminInfo(admin);

    if (!existAdmin) {
      throw new UnauthorizedException('token不正确');
    }
    return existAdmin;
  }
}

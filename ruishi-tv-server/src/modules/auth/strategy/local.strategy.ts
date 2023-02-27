import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export class UserLocalStrategy extends PassportStrategy(Strategy, 'userLocal') {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    // 调用在服务层验证的方法;
    const user = await this.authService.userLogin({ username, password });

    return user;
  }
}

export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'adminLocal',
) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    // 调用在服务层验证的方法;
    const admin = await this.authService.AdminLogin({ username, password });
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}

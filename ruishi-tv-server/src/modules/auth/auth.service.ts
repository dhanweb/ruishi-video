import { AdminService } from './../admin/admin.service';
import { TokenDto } from './dto/create-token';
import { JwtService } from '@nestjs/jwt';
import { rslog } from 'src/utils/rslog';
import { LoginDto } from './../user/dto/create-user.dto';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}
  createToken(tokenDto: TokenDto) {
    rslog.log('createToken');
    return this.jwtService.sign(tokenDto);
  }

  async userLogin(loginDto: LoginDto) {
    rslog.log('auth:login');
    const existUser = await this.userService.login(loginDto);
    if (!existUser) {
      throw new UnauthorizedException();
    }
    const { user_id, username } = existUser;
    const token = this.createToken({ user_id, username });
    return {
      token: 'Bearer ' + token,
    };
  }

  async getUserInfo(user: TokenDto) {
    return this.userService.findByUserId(user.user_id);
  }

  async AdminLogin(loginDto: LoginDto) {
    rslog.log('auth:AdminLogin');
    const existAdmin = await this.adminService.adminLogin(loginDto);
    const { admin_id, username } = existAdmin;
    const token = this.createToken({ admin_id, username });
    return {
      token: 'Bearer ' + token,
    };
  }

  async getAdminInfo(admin: TokenDto) {
    return this.adminService.findByAdminId(admin.admin_id);
  }
}

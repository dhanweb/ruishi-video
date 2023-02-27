import { rslog } from 'src/utils/rslog';
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('userLocal'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  userLogin(@Req() req) {
    return req.user;
  }

  @Get('userInfo')
  @UseGuards(AuthGuard('userJwt'))
  getUserInfo(@Req() req) {
    return req.user;
  }
}

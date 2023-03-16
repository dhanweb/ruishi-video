import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('adminLocal'))
  login(@Req() req) {
    return req.user;
  }

  @Get('info')
  @UseGuards(AuthGuard('adminJwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  getAdminInfo(@Req() req) {
    return req.user;
  }

  @Get('routes')
  @UseGuards(AuthGuard('adminJwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  getRoutes(@Req() req) {
    return [
      {
        path: '/user',
        component: 'Layout',
        redirect: '/user/list',
        meta: {
          title: '用户管理',
          icon: 'user',
          hidden: false,
          alwaysShow: true,
          roles: ['ADMIN'],
          keepAlive: true,
        },
        children: [
          {
            path: 'list',
            component: 'user/userList/index',
            name: 'userList',
            meta: {
              title: '用户列表',
              icon: 'user',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
        ],
      },
      {
        path: '/swiper',
        component: 'Layout',
        redirect: '/swiper/index',
        meta: {
          title: '轮播图管理',
          icon: 'swiper',
          hidden: false,
          alwaysShow: true,
          roles: ['ADMIN'],
          keepAlive: true,
        },
        children: [
          {
            path: 'list',
            component: 'swiper/index',
            name: 'swiperList',
            meta: {
              title: '轮播图列表',
              icon: 'swiper',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
        ],
      },
      {
        path: '/video',
        component: 'Layout',
        redirect: '/video/list',
        meta: {
          title: '视频管理',
          icon: 'video',
          hidden: false,
          alwaysShow: true,
          roles: ['ADMIN'],
          keepAlive: true,
        },
        children: [
          {
            path: 'list',
            component: 'video/videoList/index',
            name: 'videoList',
            meta: {
              title: '视频列表',
              icon: 'video',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
          {
            path: 'add',
            component: 'video/add/index',
            name: 'addVideo',
            meta: {
              title: '添加视频',
              icon: 'addvideo',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
          {
            path: 'edit/:video_id',
            component: 'video/add/index',
            name: 'editVideo',
            meta: {
              title: '编辑视频',
              icon: 'video',
              hidden: true,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: false,
            },
          },
          {
            path: 'cate',
            component: 'video/cate/index',
            name: 'cate',
            meta: {
              title: '视频分类',
              icon: 'category',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
          {
            path: 'part/:video_id',
            component: 'part/list/index',
            name: 'partList',
            meta: {
              title: '集数列表',
              icon: 'video',
              hidden: true,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: false,
            },
          },
          {
            path: 'part/add/:video_id',
            component: 'part/add/index',
            name: 'addPart',
            meta: {
              title: '新增集数',
              icon: 'video',
              hidden: true,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: false,
            },
          },
          {
            path: 'part/form/:part_id',
            component: 'part/add/index',
            name: 'editPart',
            meta: {
              title: '编辑集数',
              icon: 'video',
              hidden: true,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: false,
            },
          },
        ],
      },
    ];
  }
}

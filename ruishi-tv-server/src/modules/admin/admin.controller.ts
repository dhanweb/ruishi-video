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
              icon: 'video',
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
              icon: 'video',
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
      {
        path: '/system',
        component: 'Layout',
        redirect: '/system/user',
        meta: {
          title: '系统管理',
          icon: 'system',
          hidden: false,
          alwaysShow: true,
          roles: ['ADMIN'],
          keepAlive: true,
        },
        children: [
          {
            path: 'user',
            component: 'system/user/index',
            name: 'user',
            meta: {
              title: '用户管理',
              icon: 'user',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
          {
            path: 'role',
            component: 'system/role/index',
            name: 'role',
            meta: {
              title: '角色管理',
              icon: 'role',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
          {
            path: 'cmenu',
            component: 'system/menu/index',
            name: 'cmenu',
            meta: {
              title: '菜单管理',
              icon: 'menu',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
          {
            path: 'dept',
            component: 'system/dept/index',
            name: 'dept',
            meta: {
              title: '部门管理',
              icon: 'tree',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
          {
            path: 'dict',
            component: 'system/dict/index',
            name: 'dict',
            meta: {
              title: '字典管理',
              icon: 'dict',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
        ],
      },
      {
        path: '/api',
        component: 'Layout',
        meta: {
          title: '接口',
          icon: 'api',
          hidden: false,
          alwaysShow: true,
          roles: ['ADMIN'],
          keepAlive: true,
        },
        children: [
          {
            path: 'apidoc',
            component: 'demo/apidoc',
            name: 'apidoc',
            meta: {
              title: '接口文档',
              icon: 'api',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
        ],
      },
      {
        path: '/external-link',
        component: 'Layout',
        redirect: 'noredirect',
        meta: {
          title: '外部链接',
          icon: 'link',
          hidden: false,
          alwaysShow: true,
          roles: ['ADMIN'],
          keepAlive: true,
        },
        children: [
          {
            path: 'https://www.cnblogs.com/haoxianrui/p/16090029.html',
            meta: {
              title: 'document',
              icon: 'document',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
        ],
      },
      {
        path: '/multi-level-menu',
        component: 'Layout',
        redirect: '/nested/level1/level2',
        meta: {
          title: '多级菜单',
          icon: 'multi_level',
          hidden: false,
          alwaysShow: true,
          roles: ['ADMIN'],
          keepAlive: true,
        },
        children: [
          {
            path: 'nested_level1_index',
            component: 'nested/level1/index',
            redirect: '/nested/level1/level2',
            meta: {
              title: '菜单一级',
              icon: '',
              hidden: false,
              alwaysShow: true,
              roles: ['ADMIN'],
              keepAlive: true,
            },
            children: [
              {
                path: 'nested_level1_level2_index',
                component: 'nested/level1/level2/index',
                redirect: '/nested/level1/level2/level3',
                meta: {
                  title: '菜单二级',
                  icon: '',
                  hidden: false,
                  alwaysShow: true,
                  roles: ['ADMIN'],
                  keepAlive: true,
                },
                children: [
                  {
                    path: 'nested_level1_level2_level3_index1',
                    component: 'nested/level1/level2/level3/index1',
                    name: 'nested_level1_level2_level3_index1',
                    meta: {
                      title: '菜单三级-1',
                      icon: '',
                      hidden: false,
                      alwaysShow: false,
                      roles: ['ADMIN'],
                      keepAlive: true,
                    },
                  },
                  {
                    path: 'nested_level1_level2_level3_index2',
                    component: 'nested/level1/level2/level3/index2',
                    name: 'nested_level1_level2_level3_index2',
                    meta: {
                      title: '菜单三级-2',
                      icon: '',
                      hidden: false,
                      alwaysShow: false,
                      roles: ['ADMIN'],
                      keepAlive: true,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '/demo',
        component: 'Layout',
        meta: {
          title: '组件封装',
          icon: 'menu',
          hidden: false,
          alwaysShow: true,
          roles: ['ADMIN'],
          keepAlive: true,
        },
        children: [
          {
            path: 'editor',
            component: 'demo/editor',
            name: 'editor',
            meta: {
              title: '富文本编辑器',
              icon: '',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
          {
            path: 'uploader',
            component: 'demo/uploader',
            name: 'uploader',
            meta: {
              title: '上传组件',
              icon: '',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
          {
            path: 'icon-selector',
            component: 'demo/icon-selector',
            name: 'icon-selector',
            meta: {
              title: '图标选择器',
              icon: '',
              hidden: false,
              alwaysShow: false,
              roles: ['ADMIN'],
              keepAlive: true,
            },
          },
        ],
      },
    ];
  }
}

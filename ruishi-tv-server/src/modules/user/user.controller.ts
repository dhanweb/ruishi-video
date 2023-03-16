import { PageDto } from './../pagination/pagination.dto';
import { rslog } from 'src/utils/rslog';
import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @UseInterceptors(ClassSerializerInterceptor)
  regtster(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('userLocal'))
  login(@Req() req) {
    return req.user;
  }

  @Get('userInfo/:user_id')
  @UseGuards(AuthGuard('adminJwt'))
  getByUserId(@Param() param: { user_id }) {
    return this.userService.findByUserId(param.user_id);
  }

  @Post('update')
  @UseGuards(AuthGuard('userJwt'))
  update(@Req() req, @Body() body) {
    rslog.log('user/update', body);
    rslog.log('req.user.user_id', req.user.user_id);
    return this.userService.updateByUserId(req.user.user_id, body);
  }

  @Post('update/:user_id')
  @UseGuards(AuthGuard('adminJwt'))
  updateById(@Param() param: { user_id: number }, @Body() body) {
    const { user_id } = param;
    rslog.log('user/update', user_id);
    return this.userService.updateByUserId(user_id, body);
  }

  @Get('userInfo')
  @UseGuards(AuthGuard('userJwt'))
  userInfo(@Req() req) {
    return req.user;
  }

  /**
   * 根据id排序
   */
  @Get('find')
  @UseGuards(AuthGuard('adminJwt'))
  findUser(@Query() pager: PageDto) {
    rslog.trace('body', pager);
    return this.userService.findByPage(pager, { user_id: pager.order });
  }

  /**
   * 根据创建时间排序
   */
  @Get('find/orderByTime')
  @UseGuards(AuthGuard('adminJwt'))
  findOrderByTime(@Query() pager: PageDto) {
    rslog.trace('body', pager);
    return this.userService.findByPage(pager, { createTime: pager.order });
  }

  /**
   * 根据更新时间排序
   */
  @Get('find/orderByUpTime')
  @UseGuards(AuthGuard('adminJwt'))
  findOrderByUpTime(@Query() pager: PageDto) {
    rslog.trace('body', pager);
    return this.userService.findByPage(pager, { updateTime: pager.order });
  }

  @Post('delete/:user_id')
  @UseGuards(AuthGuard('adminJwt'))
  deleteUser(@Param() param: { user_id }) {
    const { user_id } = param;
    rslog.log('delete/:user_id', user_id);
    return this.userService.deleteByUserId(user_id);
  }

  @Post('reset/:user_id')
  @UseGuards(AuthGuard('adminJwt'))
  resetPassword(@Param() param: { user_id }) {
    const { user_id } = param;
    rslog.log('reset/:user_id', user_id);
    return this.userService.resetPassword(user_id);
  }

  @Post('collect')
  @UseGuards(AuthGuard('userJwt'))
  createCollect(@Body() body: { video_id: number }, @Req() req) {
    const { video_id } = body;
    rslog.log('collect/createCollect', video_id);
    return this.userService.createCollect(req.user.user_id, video_id);
  }

  @Get('collect')
  @UseGuards(AuthGuard('userJwt'))
  getCollect(@Req() req) {
    rslog.log('collect/createCollect');
    return this.userService.getUserCollect(req.user.user_id);
  }

  @Get('collect/:collect_id')
  @UseGuards(AuthGuard('userJwt'))
  getCollectDetail(@Param() param: { collect_id: number }, @Req() req) {
    rslog.log('collect/getCollectDetail');
    return this.userService.getCollectDetail(
      req.user.user_id,
      param.collect_id,
    );
  }

  @Post('history')
  @UseGuards(AuthGuard('userJwt'))
  addHistoryList(@Req() req, @Body() body: { video_id: number }) {
    rslog.log('collect/getCollectDetail');
    return this.userService.createHistory(req.user.user_id, body.video_id);
  }

  @Get('history')
  @UseGuards(AuthGuard('userJwt'))
  getHistoryList(@Req() req) {
    rslog.log('collect/getCollectDetail');
    return this.userService.getHistoryList(req.user.user_id);
  }

  @Post('history/:history_id')
  @UseGuards(AuthGuard('userJwt'))
  deleteHistory(@Req() req, @Param() param: { history_id: number }) {
    rslog.log('collect/getCollectDetail');
    return this.userService.deleteHistory(req.user.user_id, param.history_id);
  }
}

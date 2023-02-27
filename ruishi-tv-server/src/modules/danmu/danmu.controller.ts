import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UsePipes,
} from '@nestjs/common';
import { DanmuService } from './danmu.service';
import { CreateDanmuDto } from './dto/create-danmu.dto';
import { UpdateDanmuDto } from './dto/update-danmu.dto';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from 'src/pipe/validation.pipe';

@Controller('danmu')
export class DanmuController {
  constructor(private readonly danmuService: DanmuService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('userJwt'))
  @UsePipes(new ValidationPipe())
  create(@Req() req, @Body() createDanmuDto: CreateDanmuDto) {
    return this.danmuService.create(req.user.user_id, createDanmuDto);
  }

  @Get(':video_id')
  findAll(@Param() param: { video_id: number }) {
    return this.danmuService.findDanmuByVid(param.video_id);
  }
}

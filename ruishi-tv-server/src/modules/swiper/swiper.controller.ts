import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SwiperService } from './swiper.service';
import { CreateSwiperDto } from './dto/create-swiper.dto';
import { UpdateSwiperDto } from './dto/update-swiper.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('swiper')
export class SwiperController {
  constructor(private readonly swiperService: SwiperService) {}

  @Post()
  @UseGuards(AuthGuard('adminJwt'))
  create(@Body() createSwiperDto: CreateSwiperDto) {
    return this.swiperService.create(createSwiperDto);
  }

  @Get()
  findAll() {
    return this.swiperService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.swiperService.findOne(+id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateSwiperDto: UpdateSwiperDto) {
    return this.swiperService.update(+id, updateSwiperDto);
  }

  @Post('/delete/:id')
  remove(@Param('id') id: string) {
    return this.swiperService.remove(+id);
  }
}

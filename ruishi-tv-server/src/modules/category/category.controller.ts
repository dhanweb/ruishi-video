import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategory1Dto,
  CreateCategoryDto,
} from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ValidationPipe } from 'src/pipe/validation.pipe';

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe()) // 使用管道验证
@Controller('cate')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create1')
  @UseGuards(AuthGuard('adminJwt'))
  addCate1(@Body() createCategoryDto: CreateCategory1Dto) {
    return this.categoryService.create({ ...createCategoryDto, pid: 0 });
  }

  @Post('create2')
  @UseGuards(AuthGuard('adminJwt'))
  addCate2(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('update/:cate_id')
  @UseGuards(AuthGuard('adminJwt'))
  updateByCid(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param() param: { cate_id: number },
  ) {
    return this.categoryService.updateByCid(param.cate_id, updateCategoryDto);
  }

  @Post('delete/:cate_id')
  @UseGuards(AuthGuard('adminJwt'))
  deleteByCid(@Param() param: { cate_id: number }) {
    return this.categoryService.DeleteByCid(param.cate_id);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('find2')
  findAllCate2() {
    return this.categoryService.findAllCate2();
  }
}

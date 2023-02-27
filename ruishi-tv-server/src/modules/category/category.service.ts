import { rslog } from 'src/utils/rslog';
import { CategoryEntity } from './entities/category.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly cateRepository: Repository<CategoryEntity>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { cate_name } = createCategoryDto;
    const existCateName = await this.findByCName(cate_name);
    if (existCateName) {
      throw new HttpException('分类名称重复', HttpStatus.BAD_REQUEST);
    }
    const newCate = this.cateRepository.create(createCategoryDto);
    return await this.cateRepository.save(newCate);
  }

  async findByCName(cate_name: string) {
    return await this.cateRepository.findOne({ where: { cate_name } });
  }

  async updateByCid(cate_id: number, updateCategoryDto: UpdateCategoryDto) {
    const { cate_name } = updateCategoryDto;
    const existCateName = await this.findByCName(cate_name);
    if (existCateName && existCateName.cate_id != cate_id) {
      throw new HttpException('分类名称重复', HttpStatus.BAD_REQUEST);
    }
    const newCate = this.cateRepository.create(updateCategoryDto);

    return this.cateRepository.update({ cate_id }, newCate);
  }

  async DeleteByCid(cate_id: number) {
    return this.cateRepository.delete({ cate_id });
  }

  async findAll() {
    const result = await this.cateRepository.find();
    const newArr = [];
    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      const obj = {
        ...item,
        children: [],
        visible: false,
      };
      if (item.pid == 0) {
        for (let j = 0; j < result.length; j++) {
          const child_item = result[j];
          if (obj.cate_id == child_item.pid) {
            const obj2 = {
              ...child_item,
              visible: false,
            };
            obj.children.push(child_item);
          }
        }
        newArr.push(obj);
      }
    }
    rslog.log('result', result);
    rslog.log('newArr', newArr);
    return newArr;
  }

  async findAllCate2() {
    return this.cateRepository.find({ where: { pid: Not(0) } });
  }
}

import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty({ message: '父级分类不能为空' })
  pid: number;
  @IsString({ message: '分类名称必须为字符串！' })
  @IsNotEmpty({ message: '分类名称不能为空！' })
  cate_name: string;
}

export class CreateCategory1Dto {
  @IsString({ message: '分类名称必须为字符串！' })
  @IsNotEmpty({ message: '分类名称不能为空！' })
  cate_name: string;
}

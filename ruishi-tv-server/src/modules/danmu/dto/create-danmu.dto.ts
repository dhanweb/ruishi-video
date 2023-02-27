import { IsNotEmpty } from 'class-validator';

export class CreateDanmuDto {
  @IsNotEmpty({ message: '弹幕内容不能为空' })
  text: string;
  @IsNotEmpty({ message: '弹幕出现的时间不能为空' })
  time: number;
  color: string;
  @IsNotEmpty({ message: '弹幕对应的视频id不能空' })
  part_id: number;
}

import { IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty({ message: '视频标题不能为空' })
  title: string;
  @IsNotEmpty({ message: '视频介绍' })
  introduction: string;
  @IsNotEmpty({ message: '视频其他介绍' })
  other: string;
  cover: string;
  cate_id?: string[];
  release: string;
  is_deleted: boolean;
}

// export class CreatePartDto {
//   @IsNotEmpty({ message: '视频内容介绍不能为空' })
//   description: string;
//   @IsNotEmpty({ message: '视频播放链接不能空' })
//   url: string;
//   // @IsNotEmpty({ message: '视频封面不能为空' })
//   cover?: string;
//   tags?: string;
//   // @IsNotEmpty({ message: 'video_name不能为空' })
//   // video_name: string;
//   @IsNotEmpty({ message: 'video_id不能为空' })
//   video_id: number;
// }

export class CreatePartDto {
  @IsNotEmpty({ message: '视频内容介绍不能为空' })
  description: string;

  // @IsNotEmpty({ message: '视频播放链接不能空' })
  // url: string;
  // @IsNotEmpty({ message: '视频封面不能为空' })
  cover?: string;
  tags?: string;
  // @IsNotEmpty({ message: 'video_name不能为空' })
  // video_name: string;
  @IsNotEmpty({ message: 'video_id不能为空' })
  video_id: number;
}

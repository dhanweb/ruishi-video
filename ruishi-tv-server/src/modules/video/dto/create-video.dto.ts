import { VideoEntity } from './../entities/video.entity';
import { PartialType } from '@nestjs/mapped-types';
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

export class CreatePartDto {
  @IsNotEmpty({ message: '视频内容介绍不能为空' })
  description: string;

  cover?: string;
  tags?: string;

  @IsNotEmpty({ message: 'video_id不能为空' })
  video_id: number;
  video?: VideoEntity;
}

export class IndexVideoList {
  category: number;
  video: VideoEntity[];
}

export class IProgress {
  part_id: number;
  progress: number;
}

export class IEventSet {
  EventSet: [
    {
      EventType: 'NewFileUpload' | 'ProcedureStateChanged';
      EventHandle: string;
      ProcedureStateChangeEvent?: {
        FileName: string;
        FileUrl: string;
        Duration: number;
        FileId: string;
        MediaProcessResultSet: [
          {
            TranscodeTask: {
              Status: 'SUCCESS';
              Output: {
                Url: string;
                Duration: string;
              };
            };
          },
          {
            CoverBySnapshotTask: {
              Status: 'SUCCESS';
              Output: {
                CoverUrl: string;
              };
            };
          },
        ];
      };
      FileUploadEvent?: {
        FileId: string;
        MediaBasicInfo: {
          Name: string;
          CoverUrl: string;
          MediaUrl: string;
          CreateTime: string;
        };
        MetaData: {
          Duration: number;
          Size: number;
        };
      };
    },
  ];
}

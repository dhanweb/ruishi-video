export interface IVideoInfo {
  video_id: number;
  title: string;
  introduction: string;
  other: string;
  likes: number;
  views: number;
  comments: number;
  score: string;
  release: string;
  published_at: Date;
  updated_at: Date;
  cover: string;
  is_deleted: boolean;
  cate_id: number[];
  category: ICateInfo[];
}

export interface ICateInfo {
  cate_id: number;
  cate_name: string;
  sort: number;
  pid: number;
  visible: boolean;
  children?: ICateInfo[];
}

export interface IPartInfo {
  part_id: number;
  description: string;
  duration: string;
  url: string;
  cover: string;
  tags?: any;
}
export interface IVideoDetail extends IVideoInfo {
  parts: IPartInfo;
}

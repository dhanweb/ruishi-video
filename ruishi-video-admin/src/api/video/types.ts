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
  parts?: IPartInfo[];
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
  url2: string;
  cover: string;
  tags?: any;
  status?: boolean;
  progress?: number;
  uploading?: boolean;
  video_id?: number;
}
// export interface IVideoDetail {
//   video: IVideoInfo;
//   inComplete: IPartInfo[];
// }

export interface ICategoryParam {
  category: number[];
}

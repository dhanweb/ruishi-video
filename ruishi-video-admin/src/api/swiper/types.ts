export interface ISwiper {
  id: number;
  title: string;
  url: string;
  video: {
    video_id: number;
    title: string;
  };
}

export interface ISwiperParam extends ISwiper {
  video_id: number;
}

export type SwiperParam = {
  [P in keyof ISwiper]?: ISwiper[P];
};

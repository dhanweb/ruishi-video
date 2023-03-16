import request from '@/utils/request';
import { ISwiper, SwiperParam } from './types';

export function getSwiperListApi(): ResultType<ISwiper[]> {
  return request({
    url: '/swiper',
    method: 'get'
  });
}

export function addSwiperApi(data: ISwiper): ResultType<ISwiper[]> {
  return request({
    url: '/swiper',
    method: 'post',
    data
  });
}

export function updateSwiperApi(
  id: number,
  data: SwiperParam
): ResultType<ISwiper[]> {
  return request({
    url: `/swiper/${id}`,
    method: 'post',
    data
  });
}

export function deleteSwiperApi(id: number) {
  return request({
    url: `/swiper/delete/${id}`,
    method: 'post'
  });
}

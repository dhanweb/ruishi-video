import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { IVideoInfo, ICateInfo, IVideoDetail, IPartInfo } from './types';

/**
 *  关键词和分页获取视频列表
 */
export function getVideoList(data: PagerParams): ResultType<IVideoInfo> {
  return request({
    url: '/video/find',
    method: 'get',
    params: data
  });
}

/**
 * 上下架视频
 */
export function tollgeVideoApi(video_id: number) {
  return request({
    url: `/video/toggle/${video_id}`,
    method: 'post'
  });
}

/**
 * 新增视频
 */
export function addVideoApi(data: IVideoInfo) {
  return request({
    url: `/video`,
    method: 'post',
    data
  });
}
/**
 * 编辑视频
 */
export function editVideoApi(video_id: number, data: IVideoInfo) {
  return request({
    url: `/video/update/${video_id}`,
    method: 'post',
    data
  });
}

/**
 * 获取视频信息
 */
export function getVideoInfoApi(video_id: number): ResultType<IVideoInfo> {
  return request({
    url: `/video/detail/${video_id}`,
    method: 'get'
  });
}

/**
 * 获取视频分类
 */
export function getCateListApi(): ResultType<ICateInfo[]> {
  return request({
    url: `/cate`,
    method: 'get'
  });
}

/**
 * 获取视频分类
 */
export function getCate2List(): ResultType<ICateInfo[]> {
  return request({
    url: `/cate/find2`,
    method: 'get'
  });
}

/**
 * 编辑分类
 */
export function editCateApi(id: number, data: ICateInfo) {
  return request({
    url: `/cate/update/${id}`,
    method: 'post',
    data
  });
}

/**
 * 删除分类
 */
export function delCateApi(id: number) {
  return request({
    url: `/cate/delete/${id}`,
    method: 'post'
  });
}

/**
 * 添加一级分类
 */
export function addCate1Api(data: ICateInfo) {
  return request({
    url: '/cate/create1',
    method: 'post',
    data
  });
}

/**
 * 添加二级分类
 */

export function addCate2Api(data: ICateInfo) {
  return request({
    url: '/cate/create2',
    method: 'post',
    data
  });
}

/**
 * 获取视频的详细信息
 */
export function getPartInfoApi(video_id: number): AxiosPromise<IVideoDetail> {
  return request({
    url: `/video/detail/${video_id}`
  });
}

/**
 * 每一集的详情
 */
export function getPartDetailApi(part_id: number): AxiosPromise<IPartInfo> {
  return request({
    url: `/video/part/${part_id}`
  });
}

/**
 * 新建集数信息和上传视频
 */
export function addPartInfoApi(data) {
  return request({
    url: '/upload/video',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 *
 */
export function deletePartApi(part_id: number) {
  return request({
    url: '/video/part/' + part_id,
    method: 'post'
  });
}

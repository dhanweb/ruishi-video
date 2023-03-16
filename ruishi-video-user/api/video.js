import request from '../utils/request.js'

export function getVideoListApi(search) {
  return request({
    url: '/video/find',
    method: 'get',
    data: search
  })
}

export function getVideoDetailApi(id) {
  return request({
    url: `/video/detail/${id}`
  })
}

export function sentDanmuApi(data) {
  return request({
    url: '/danmu',
    method: 'post',
    data
  })
}

export function getDanmuLstApi(part_id) {
  return request({
    url: `/danmu/${part_id}`,
  })
}

// 分类搜索视频
export function getVideoCateListApi(data) {
  return request({
    url: '/video/cate',
    method: 'post',
    data
  })
}

/**
 * 获取播放链接
 */
export function generateUrlApi(url) {
  return request({
    url: 'video/key',
    method: 'post',
    data: {
      url
    }
  })
}

/**
 * 获取每一集的详情
 */
export function getPartInfoApi(part_id) {
  return request({
     url: `/video/part/${part_id}`
   });
}
import request from '../utils/request.js'

export function loginApi(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export function registerApi(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data,
  })
}

export function getUserInfoApi() {
  return request({
    url: '/user/userInfo',
    method: 'get',
  })
}

// 收藏/取消收藏
export function collectApi(video_id) {
  return request({
    url: `/user/collect`,
    method: 'post',
    data: {
      video_id
    }
  })
}

// 获取收藏列表
export function getCollectApi() {
  return request({
    url: '/user/collect',
    method: 'get'
  })
}

// 新增播放记录
export function addRecordApi(video_id) {
  return request({
    url: '/user/history',
    method: "post",
    data: {
      video_id
    }
  })
}

// 获取播放记录
export function getHistoryApi() {
  return request({
    url: '/user/history',
    method:'get'
    
  })
}

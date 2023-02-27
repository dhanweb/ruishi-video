import request from '../utils/request.js'

export function loginApi(data) {
  return request({
    url: '/user/login',
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

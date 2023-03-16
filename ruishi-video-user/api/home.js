import request from '../utils/request.js'

export function getSwiperListApi() {
  return request({
    url: '/swiper'
  })
}
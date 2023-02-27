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

export function sentDanmuApi( data) {
  return request({
    url: '/danmu',
    method:'post',
    data
  })
}

export function getDanmuLstApi(part_id) {
  return request({
    url: `/danmu/${part_id}`,
  })
}
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/getLogin',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/login/getInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'delete'
  })
}

export function reg(data) {
  return request({
    url: '/login/reg',
    method: 'post',
    data
  })
}

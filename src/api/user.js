import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/getLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'delete'
  })
}

export function getAll() {
  return request({
    url: '/user/getAll',
    method: 'get'
  })
}
//@RequestBody UserQo userQo
export function updateInfo(data) {
  return request({
    url: '/user/updateInfo',
    method: 'post',
    data
  })
}

export function delUser(data) {
  return request({
    url: '/user/delUser',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function getAllLog() {
    return request({
        url: '/visitor_log/getAll',
        method: 'get'
    })
}

export function getChartData() {
    return request({
        url: '/visitor_log/getChartData',
        method: 'get'
    })
}

export function getBySearch(data) {
    return request({
        url: '/visitor_log/getBySearch',
        method: 'post',
        data
    })
}

export function delLog(data) {
    return request({
        url: '/visitor_log/delLog',
        method: 'post',
        data
    })
}

export function demoIn(data) {
    return request({
        url: '/visitor_log/in',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function demoOut(data) {
    return request({
        url: '/visitor_log/out',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function getLogPic(data) {
    return request({
        url: '/visitor_log/getLogPic',
        method: 'post',
        data
    })
}

export function getLogBySpace(data) {
    return request({
        url: '/visitor_log/getLogBySpace',
        method: 'post',
        data
    })
}

export function openCV() {
    return request({
        url: '/visitor_log/openCV',
        method: 'get'
    })
}

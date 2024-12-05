import request from '@/utils/request'

export function getVisitorZip(data) {
    return request({
        url: '/visitor/getVisitorZip',
        method: 'post',
        data
    })
}

export function getVisitorExcel(data) {
    return request({
        url: '/visitor/getVisitorExcel',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

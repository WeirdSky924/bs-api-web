import request from '@/utils/request'

export function getVisitorStatistics() {
    return request({
        url: '/statistics/getVisitorStatistics',
        method: 'get'
    })
}

export function getVisitorByDepartmentStatistics() {
    return request({
        url: '/statistics/getVisitorByDepartmentStatistics',
        method: 'get'
    })
}

export function getVisitorBySpaceStatistics() {
    return request({
        url: '/statistics/getVisitorBySpaceStatistics',
        method: 'get'
    })
}

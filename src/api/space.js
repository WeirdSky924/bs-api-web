import request from '@/utils/request'

export function getAllSpace() {
    return request({
        url: '/visitor_space/getMySpace',
        method: 'get'
    })
}
//@RequestBody VisitorSpaceQo visitorSpaceQo
export function saveOrUpdateSpace(data) {
    return request({
        url: '/visitor_space/saveOrUpdateSpace',
        method: 'post',
        data
    })
}
//@RequestParam("spaceIds") String spaceIds
export function delSpace(data) {
    return request({
        url: '/visitor_space/delSpace',
        method: 'post',
        data
    })
}

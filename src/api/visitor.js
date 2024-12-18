import request from '@/utils/request'

export function getAllVisitor() {
    return request({
        url: '/visitor/getAll',
        method: 'get'
    })
}

export function getBySpace(data) {
    return request({
        url: '/visitor/getBySpace',
        method: 'post',
        data
    })
}

//@RequestParam("file") MultipartFile file, Visitor visitor
export function saveOrUpdateVisitor(data) {
    return request({
        url: '/visitor/saveOrUpdateVisitor',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}
//@RequestParam("visitorIds") String visitorIds
export function delVisitor(data) {
    return request({
        url: '/visitor/delVisitor',
        method: 'post',
        data
    })
}

export function saveVisitor(data) {
    return request({
        url: '/visitor/saveVisitor',
        method: 'post',
        data
    })
}

export function updateVisitor(data) {
    return request({
        url: '/visitor/updateVisitor',
        method: 'post',
        data
    })
}

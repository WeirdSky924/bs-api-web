import request from '@/utils/request'

export function getAllDepartment() {
    return request({
        url: '/department/getAll',
        method: 'get'
    })
}

//@RequestParam("departmentIds") String departmentIds
export function delDepartment(data) {
    return request({
        url: '/department/delDepartment',
        method: 'post',
        data
    })
}

// @RequestBody DepartmentQo departmentQo
export function saveOrUpdateDepartment(data) {
    return request({
        url: '/department/saveOrUpdateDepartment',
        method: 'post',
        data
    })
}

export function getMyDepartment() {
    return request({
        url: '/department/getMyDepartment',
        method: 'get'
    })
}

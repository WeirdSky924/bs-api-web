export function validateEmail(rule, value, callback) {
    if (value === '' || value === undefined) {
        callback(new Error('请正确填写邮箱'));
    } else {
        if (value !== '') {
            var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (!reg.test(value)) {
                callback(new Error('请输入有效的邮箱'));
            }
        }
        callback();
    }
}
export function validateMobilePhone(rule, value, callback) {
    if (value === '' || value === undefined) {
        callback(new Error('负责人手机号不可为空'));
    } else {
        if (value !== '') {
            var reg = /^1[3456789]\d{9}$/;
            if (!reg.test(value)) {
                callback(new Error('请输入有效的手机号码'));
            }
        }
        callback();
    }
}
export function validateNotEmpty(rule, value, callback) {
    if (value === '' || value === undefined) {
        callback(new Error('内容不可以为空'));
    }
    callback();
}
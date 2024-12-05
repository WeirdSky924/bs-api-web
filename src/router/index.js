import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/login'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: '首页',
            component: () => import('@/views/dashboard/index'),
            meta: {title: '首页', icon: 'dashboard'}
        }]
    },

    {
        path: '/checkIn',
        component: Layout,
        redirect: '/checkIn/checkInSingle',
        name: 'CheckIn',
        meta: {title: '登记访客', icon: 'el-icon-s-help'},
        children: [
            {
                path: 'checkInSingle',
                name: 'CheckInSingle',
                component: () => import('@/views/visitor/index'),
                meta: {title: '单个登记', icon: 'el-icon-plus'}
            },
            {
                path: 'importAll',
                name: 'ImportAll',
                component: () => import('@/views/visitor/upload'),
                meta: {title: '导入登记', icon: 'el-icon-upload2'}
            }
        ]
    },

    {
        path: '/visitorLog',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'VisitorLog',
                component: () => import('@/views/visitorLog/index'),
                meta: {title: '访客记录', icon: 'el-icon-user-solid'}
            }
        ]
    },
    {
        path: '/myDepartment',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'MyDepartment',
                component: () => import('@/views/deaprtment/mydepartment.vue'),
                meta: {title: '我的部门', icon: 'el-icon-s-shop'}
            }
        ]
    },
    {
        path: '/space',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'Space',
                component: () => import('@/views/space/index.vue'),
                meta: {title: '访客空间', icon: 'el-icon-s-promotion'}
            }
        ]
    },
    {
        path: '/statistics',
        component: Layout,
        redirect: '/statistics/visitorStatistics',
        name: 'Statistics',
        meta: {
            title: '统计信息',
            icon: 'el-icon-s-management'
        },
        children: [
            {
                path: 'visitorStatistics',
                component: () => import('@/views/statistics/visitorStatistics'),
                name: 'VisitorStatistics',
                meta: {title: '访客情况', icon: 'el-icon-data-line'}
            },
            {
                path: 'visitorByDepartmentStatistics',
                component: () => import('@/views/statistics/visitorByDepartmentStatistics'),
                name: 'VisitorByDepartmentStatistics',
                meta: {title: '部门情况', icon: 'el-icon-data-line'}
            },
            {
                path: 'visitorBySpaceStatistics',
                component: () => import('@/views/statistics/visitorBySpaceStatistics'),
                name: 'VisitorBySpaceStatistics',
                meta: {title: '空间情况', icon: 'el-icon-data-line'}
            },
        ]
    },
    {
        path: '/set',
        component: Layout,
        redirect: '/set/userEdit',
        meta: {
            title: '系统管理',
            icon: 'el-icon-s-tools'
        },
        children: [
            {
                path: 'userEdit',
                name: 'UserEdit',
                component: () => import('@/views/set/index'),
                meta: {title: '用户管理', icon: 'el-icon-user'},
            },
            {
                path: '/department',
                name: 'Department',
                component: () => import('@/views/deaprtment/index'),
                meta: {title: '部门信息', icon: 'el-icon-s-shop'}
            },
            // {
            //     path: 'demo',
            //     name: 'Demo',
            //     component: () => import('@/views/demo/index.vue'),
            //     meta: {title: '模拟页面', icon: 'el-icon-sunrise-1'},
            // }
        ]
    },
    {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router

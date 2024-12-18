export default {
    // 网站标题
    head: {
        title: '考勤管理系统',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '使用 Nuxt.js 构建的应用' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },

    // 全局 CSS 文件
    css: ['~/assets/main.css'],

    // 插件配置
    plugins: [],

    // 模块配置
    modules: [],

    // 构建配置
    build: {},
}

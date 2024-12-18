module.exports = ({
    //开启代理服务器
    devServer: {
        proxy: 'http://127.0.0.1:9089',
        // proxy: 'http://weirdsky.cn',
        port: 80
    },
    publicPath: process.env.NODE_PATH === 'production' ? '' : '',
    outputDir: "dist",
    indexPath: "./index.html",
    parallel: true
})

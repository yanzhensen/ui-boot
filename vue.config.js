const webpack = require('webpack')//作用：配置jq，网上copy固定写法
const envir = process.env.VUE_APP_TITLE
module.exports = {
  publicPath: envir == 'online' ? '/' : './',
  outputDir: envir == 'online' ? 'onlineui' : 'testui', //build输出目录
  assetsDir: 'assets', //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  productionSourceMap: envir == 'online' ? false : true,
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: "0.0.0.0",
    port: '8080',
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: "http://172.18.88.11",
        // target: "http://172.18.88.108",
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        cookiePathRewrite: {
          '/': '/api'
        },
        // logLevel:'debug'
      },
    },
  },


  configureWebpack: {//作用：配置jq，网上copy固定写法
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })
    ]
  }

}

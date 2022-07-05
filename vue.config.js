module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://jiaoyisuo.dfb.io/api/", // 接口地址
        ws: true, // 是否启用websockets
        changOrigin: true, //允许跨域  Origin源127.0.0.1:9000
        pathRewrite: {
          "^/api": "" //请求的时候使用这个/api前缀就可以
        }
      }
    },
    overlay: {
      warning: false,
      errors: false
    }
  },
  publicPath: './',
  productionSourceMap: false,

}

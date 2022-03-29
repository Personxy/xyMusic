module.exports = {
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    proxy: {
      // 代理
      '^/api': {
        // 请求的地址
        target: 'https://netease-cloud-music-api-puce-iota.vercel.app/',
        // 跨域
        changeOrigin: true,
        hot: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};

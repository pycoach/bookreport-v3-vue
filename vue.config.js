const path = require('path')
const webpack = require('webpack')

module.exports = {
  publicPath: process.env.NODE_ENV == 'production' ? '/' : '/',
  transpileDependencies: [
      /\/node_modules\/vue-echarts\//,
      /\/node_modules\/resize-detector\//
  ],
  configureWebpack: {
    resolve: {
      alias: {
        Api: path.resolve(__dirname, 'src/api/'),
        Components: path.resolve(__dirname, 'src/components/'),
        Views: path.resolve(__dirname, 'src/views/'),
      },
      extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery'
      })
    ]
  }
}
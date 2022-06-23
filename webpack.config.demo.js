/*
 * 构建用于npm加载的 umd 包, 不包含axios
 * axios 声明为peerDependencies, 由使用方安装
 * package.json module 指向这个bundle
 */

const { merge } = require('webpack-merge');
const {
  getCommon,
  feConfig,
  packageName,
  resolve
} = require('./webpack.config.common');
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {
  // const isProd = env.NODE_ENV === 'production';
  // const isReport = !!env.report

  const config = merge(getCommon(env), {
    entry: {
      'index-demo': resolve('example/index.ts'),
      'vue2-demo': resolve('example/vue2-demo/main'),
      'vue3-demo': resolve('example/vue3-demo/main'),
      'js-demo': resolve('example/js-demo/main')
    },
    devServer:
      process.env.USE_HTTPS === 'yes'
        ? {
            host: process.env.HOST || 'localhost',
            port: 443,
            allowedHosts: 'all',
            https: {
              key: fs.readFileSync(
                path.resolve(process.env.CERT_DIR || '.', 'cert-key.pem')
              ),
              cert: fs.readFileSync(
                path.resolve(process.env.CERT_DIR || '.', 'cert.pem')
              )
            },
            hot: true,
            open: true
          }
        : {
            allowedHosts: 'all',
            port: 9002,
            hot: true,
            open: true,
            static: {
              directory: './public',
              publicPath: '/public'
            }
          },
    plugins: [
      new HtmlWebpackPlugin({
        title: `${packageName} 使用示例`,
        template: resolve('./template/index.html'),
        filename: 'index.html',
        chunks: ['index-demo'],
        inject: 'body'
      }),
      new HtmlWebpackPlugin({
        title: `${packageName} vue2使用示例`,
        template: resolve('./template/vue2-demo-tpl.html'),
        filename: 'vue2-demo.html',
        chunks: ['vue2-demo'],
        inject: 'body',
        feConfig
      }),
      new HtmlWebpackPlugin({
        title: `${packageName} vue3使用示例`,
        template: resolve('./template/vue3-demo-tpl.html'),
        filename: 'vue3-demo.html',
        chunks: ['vue3-demo'],
        inject: 'body'
      }),
      new HtmlWebpackPlugin({
        title: `${packageName} 原生js使用示例`,
        template: resolve('./template/js-demo-tpl.html'),
        filename: 'js-demo.html',
        chunks: ['js-demo'],
        inject: 'body'
      })
    ]
  });

  return config;
};

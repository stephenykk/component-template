/*
 * 构建 umd 包
 */

const { merge } = require('webpack-merge');
const { getCommon, resolve } = require('./webpack.config.common');

module.exports = function (env) {
  const config = merge(getCommon(env), {
    entry: {
      main: resolve('src/index.ts')
    },
    externals: {
      axios: 'axios'
    }
  });

  return config;
};

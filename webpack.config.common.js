/* 
* 公共webpack配置
*/

require('dotenv').config({ path: './.env' });

// const fs = require('fs');
const path = require('path');

// foo-bar => FooBar
function getLibraryName() {
  let name = process.env.npm_package_name
  name = name.replace(/[-_](\w)/g, (m, c) => c.toUpperCase())
  name = name.replace(/^\w/, m => m.toUpperCase())
  return name
}


const webpack = require('webpack')
const ProgressbarWebpackPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

const projectName = 'corepc'
const { getComplieConfig } = require('yxt-fe-center')
const { generateVOssConfig } = require('oss-webpack-plugin')
const feConfig = getComplieConfig(projectName, 'dev', 'dev')
const { ossToken } = feConfig

const resolve = filePath => path.resolve(__dirname, filePath);
const packageName = getLibraryName()

function getCommon (env) {
  
  const isProd = env.NODE_ENV === 'production';
  const isReport = !!env.report

  const config = generateVOssConfig({
    mode: isProd ? 'production' : 'development',
    target: ['web', 'es5'],
    output: {
      path: resolve('dist'),
      filename: '[name].js',
      publicPath: '/',
      library: packageName,
      libraryTarget: 'umd',
      libraryExport: 'default',
      pathinfo: isProd ? false : true
    },
    resolve: {
      alias: {
        '@': resolve('src')
      },
      modules: ['node_modules'],
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    externals: {
      vue: 'Vue'
    },
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?|babel|es6)$/,
          include: process.cwd(),
          loader: 'babel-loader',
          exclude: [/node_modules/, resolve('es')]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(svg|jpe?g|png|gif)$/,
          loader: 'url-loader',
          options: {
            query: {
              limit: 10000,
              name: path.posix.join('images', '[name].[ext]')
            }
          }
        },
        {
          test: /\.(ttf|otf|woff2?)$/,
          loader: 'url-loader'
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(process.env.npm_package_version),
        PACKAGE_NAME: process.env.npm_package_name.replace(/(?:^|[_-])(\w)/g, (m, c) => c.toUpperCase())
      }),
      new ProgressbarWebpackPlugin(),
      new VueLoaderPlugin()
    ]
  }, { ossToken })
  
  if(isReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    config.plugins.push(new BundleAnalyzerPlugin())
  }

  return config
}

module.exports = {
  getCommon,
  feConfig,
  packageName,
  resolve
}
# 组件模板
组件开发项目模板

## 安装

```bash
npm i -g yxtnpm
yxtnpm i
```

## 开发

```bash
npm run dev
```

## 发布

```bash
# 发布beta
npm run release:beta

# 发布stable
npm run release:stable

# 发布正式版
npm run release

# 更新到指定版本 如 2.0.1
node build/updateVersion.js latest 2.0.0
yarn release

# 更新到指定版本 如 2.0.0-beta.2
node build/updateVersion.js beta  2.0.0-beta.1
yarn release:beta

```

## 包体积分析

```bash
npm run analyze
```


## 使用文档

- vue技术栈项目
   ```js
      // your desc
   ```
- 非vue技术栈项目
   ```js
      // your desc
   ```

## 优化相关

1. 构建两种版本
   - UMD版  
      适用于`<script>`标签方式引用，包含 axios es6-polyfill, 体积较大
   - CMD版本  
      适用于webpack等构建工具引用，不包含 axios es6-polyfill, 体积较小。  
      axios 声明为 peerDependencies ，需要使用方手动安装，避免包源码和使用方重复打包axios。  
      针对IE10兼容问题，yxt-pc已包含polyfill, 所以也不打包polyfill代码
2. webpack项目默认用CMD版本 
   `package.json`增加*module*字段(*值为CMD版本*)，打包工具默认使用CMD版本，比较轻量 *!!注意: 若项目没用到axios, 需手动安装axios* 
3. 导出ES版本 
   对tree-shaking友好，更加轻量。  
   若只需组件内的部分函数/子组件，可以部分导入 如: `import { getOpenDataJSX } from 'yxt-open-data/es`, 其他没用到的模块，很容易被tree-shaking过滤掉

   > ES版本来自babel对src目录的编译，webpack相关的特性都不支持，  
   > 所以对路径别名(如: @/xx), 或 webpack.DefinePlugin定义的变量，  
   > 需要 build/compile.js 脚本替换  

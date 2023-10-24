---
title: "Webpack中Dll与externals"
date: "2023-01-02 10:30:39"

---

## 概述
在webpack中`Dll`(Dynamic link library)和`externals`都是用来解决同一个问题：单独抽离第三方库，加快webpack构建速度，但是它们又有本质的区别。

<a name="zH3gP"></a>

### externals

1. 配置`webpack.config.js`的`externals`，使不经常更新的第三方库不会打包到bundle中
2. 在`index.html`中通过CDN方式，用`script`标签引入第三方库

例子
```typescript
module.exports = {
  ...
  externals: {
    react: 'react'
  }
}
```

```html
<html>
  ...
  <body>
    <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"/>
  </body>
</html>
```
可以看出，`**externals**`**的本质就是不打包指定的库，而是在运行时再通过网络请求CDN形式引入依赖**
<a name="ecP2t"></a>

### Dll
`Dll`的使用相对`externals`要复杂点，两者虽然都是抽离第三方库，但是`externals`是通过网络请求CDN的形式引入第三方库，而`Dll`是通过将第三方库单独抽离单独打包，并且生成一个用于映射的json文件，最终将这些数据存放在硬盘中，在二次构建时可以直接跳过第三方库的编译，从硬盘中读取数据，以此加快编译速度。

但是`Dll`配置起来比较麻烦，大致步骤是：

1. 配置一个用于单独打包第三方库的webpack配置文件`webpack.dll.js`
2. 通过webpack运行`webpack.dll.js`配置文件，用于打包第三方库和生成映射文件`manifest.json`
3. 在打包业务代码的webpack配置文件`webpack.config.js`中链接Dll文件，这里使用到webpack内置的`webpack.DllReferencePlugin`，在打包时，会通过映射文件找到第三方库的代码

只有通过以上三步才能完成Dll的使用，看起来十分复杂

<a name="wxWx6"></a>
#### AutoDllPlugin
AutoDllPlugin帮我自动化了以上三步，只需要在`webpack.config.js`中配置这个插件即可完成第三方库抽离
```typescript
const path = require('path')
const AutoDllPlugin = require('autodll-webpack-plugin') // 1. 引入插件

module.exports = {
  ...
  plugins: [
    // 2. 配置要打包成dll的文件
    new AutoDllPlugin({
      inject: true, // 设为true表示把dll文件插入到index.html中
      filename: '[name].dll.js',
      context: path.resolve(__dirname, '../'), // context路径必须与package.json相同
      entry: {
        react: [
          'react',
          'react-dom'
        ]
      }
    })
  ]
}
```

<a name="or7Xp"></a>
#### 弃用Dll
在2018年的时候，Vue和React的脚手架都放弃使用Dll作为打包优化了，原因是webpack4已经提供了足够好用的优化，Dll的优化效果已经不明显了
<a name="zoRdK"></a>
#### webpack5内置功能
在webpack5中，已经有内置了`HardSourceWebpackPlugin`来进行构建加速了，不需要这些Dll了.....

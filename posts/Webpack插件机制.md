---
title: "Webpack插件机制"
date: "2022-11-04 19:50:10"

---
### webpack两大核心对象
webpack有两大核心对象：`compiler`和`compilation`，这两个对象暴露了webpack整个构建生命周期的事件钩子，我们在编写插件的时候可以通过在apply函数中订阅这两个对象暴露出来的钩子，从而完成一些自己的逻辑。

### tapable架构
上面说到的事件钩子是基于一个发布订阅库`tapable`实现的，在webpack初始化生成compiler对象时，会定义一个hooks对象来存放事件和事件对应的tapable钩子实例，当webpack执行到某个时机时就会发布事件，订阅者就可以收到消息，从而构成一个庞大的插件运行机制。这个tapable库除了提供最基础的事件发布订阅功能外，还有其他三类的钩子提供给开发者：waterfall、bail和loop。需要注意的是，如果是异步钩子函数，在执行完逻辑之后需要调用`callback`函数，告诉webpack可以继续流程

整个webpack构建流程都是基于tapable架构，来构建出一个庞大的插件机制系统，开发者只需要订阅事件，就可以在webpack特定的构建时机执行逻辑，从而扩展webpack的功能

#### tapable钩子类型
tapable除了提供最基础的事件发布订阅功能外，还提供几种类型的钩子，使发布订阅更加强大。

- 按执行机制：
   - 普通钩子（SyncHook）：提供最基础的发布订阅功能
   - waterfall钩子：函数的执行结果会通过参数形式传递给下一个函数
   - bail钩子：如果一个函数的返回值不是undefined，就不会继续执行后面的函数，提供一个熔断机制
   - loop钩子：当函数返回值不是undefined时，会回到第一个钩子重新执行，如果函数返回值是undefined，那就继续执行下一个函数
- 按同步异步类型：
   - 同步钩子：tap/call
   - 异步钩子：tapAsync/callAsync...
- 按执行方式：
   - 串行（series）：按顺序执行订阅函数
   - 并行（parallel）：同时执行多个订阅函数

在webpack中使用到的钩子类型如下：

| 名称 | 简介 | 统计 |
| --- | --- | --- |
| SyncHook | 同步钩子 | webpack共出现了71次，如compiler.hooks.compilation |
| SyncBailHook | 同步熔断钩子 | webpack共出现了66次，如compiler.hooks.shouldEmit |
| SyncWaterfallHook | 同步瀑布流钩子 | webpack共出现了37次，如compiler.hooks.assetPath |
| SyncLoopHook | 同步循环钩子 | webpack中未使用 |
| AsyncParallelHook | 异步并行钩子 | webpack中仅出现了1次，compiler.hooks.make |
| AsyncParallelBailHook | 异步并行熔断钩子 | webpack中未使用 |
| AsyncSeriesHook | 异步串行钩子 | webapck共出现了16次，如compiler.hooks.done |
| AsyncSeriesBailHook | 异步串行熔断钩子 | webpack中未使用 |
| AsyncSeriesLoopHook | 异步串行循环钩子 | webapck中未使用 |
| AsyncSeriesWaterfallHook | 异步串行瀑布流钩子 | webpack中共使用5次，如NormalModuleFactory.hooks.beforeResolve |

> 钩子的差异与使用的注意事项还是有的，比如使用同步瀑布流钩子时，初始化钩子实例需要传参，call的时候也要传参等等，具体可以参考：[https://mp.weixin.qq.com/s?__biz=Mzg3OTYwMjcxMA==&mid=2247483941&idx=1&sn=ce7597dfc8784e66d3c58f0e8df51f6b&scene=21#wechat_redirect](https://mp.weixin.qq.com/s?__biz=Mzg3OTYwMjcxMA==&mid=2247483941&idx=1&sn=ce7597dfc8784e66d3c58f0e8df51f6b&scene=21#wechat_redirect)

#### 
#### 动态编译
当开发者发布消息时 call/callAsync/callPromise，tapable会根据钩子类型、参数和执行顺序等信息动态生成执行函数。

#### tapable解决了什么问题

1. 【接口】：需要提供一套逻辑接入方法，让开发者能够将逻辑在特定时机插入到特定的位置
2. 【输入】：如何将上下文信息高效地传给插件
3. 【输出】：插件如何将执行结果返回给webpack

针对这些问题，webpack为开发者提供了基于tapable的插件机制：

1. 编译过程中通过钩子的形式，在特定时机通知插件
2. 通过tapable提供的回调机制，通过参数形式将上下文信息传递给插件
3. 通过熔断等特定类型的钩子，将插件执行结果返回给整个系统，让系统知道执行结果并继续下一步的操作



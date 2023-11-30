---
title: "headless组件集：shadcn/ui"
date: "2023-10-20 20:33:34"

---
![image-20231130214947455](https://cdn.jsdelivr.net/gh/hinhinlaw/blog-resources@main/images/post/shadcnui202311302149810.png)

最近了解到一个“组件库”——shadcn/ui，它是一个headless“组件库”，shadcn/ui有什么特别之处呢？我们看看它官网的描述：

> This is NOT a component library. It's a collection of re-usable components that you can copy and paste into your apps

1. 这个不是一个传统意义上的组件库；
2. shadcn/ui是一个可复用组件的集合；
3. 你可以直接在官网上看文档找你想要的组件，并且能直接复制代码进去你自己的项目中，直接使用组件；



### 特点一：无需使用npm安装组件

我们平时使用的组件库比如：ant-design、element-ui，我们在使用它们的时候，需要通过npm或者yarn来安装依赖到自己的项目中，这种是传统的组件库。而shadcn/ui不能通过npm安装，而是在使用时通过CLI工具将组件的代码直接复制到项目中。

![image-20231130221212826](https://cdn.jsdelivr.net/gh/hinhinlaw/blog-resources@main/images/post/shadcnui202311302212340.png)

比如我想用这个tooltip组件，我只需要在项目的根目录下执行命令行：`npx shadcn-ui@latest add tooltip `，就可以将tooltip的代码生成到项目中：

![image-20231130221332449](https://cdn.jsdelivr.net/gh/hinhinlaw/blog-resources@main/images/post/shadcnui202311302213138.png)

然后就可以直接在项目中使用，注意，整个过程都没有使用npm install或者yarn add安装组件，就可以使用到组件了！它提供给我们组件应有的基础能力，比如tooltip就是一个能在hover时弹出一个气泡的组件，这个是它作为非传统组件库的一个特点。



### 特点二：轻松修改组件样式，实现你自己风格的组件

因为它是基于radix-ui和tailwindcss实现的，所有的组件样式都是直接展现在CLI工具生成的组件代码中的，所以我们能轻轻松松地修改组件的样式，这对于要实现一套自己公司的风格的组件库的小伙伴来说，简直就是福音，试想下平时我们使用ant-design，如果UI或者产品说这个按钮不太好看，需要改改样式，这是一件多么头痛的事，我们要写代码去hack组件的样式，还要不断调整，来覆盖ant-design组件原来的样式。

------
对了，本博客中所有的ui组件都是用shadcn/ui实现的:D
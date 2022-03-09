# Gatsby本地开发 & 路由和页面

## 环境变量

所有的项目和OS环境变量只在构建时可用或Node.js运行时。它们不应该在客户端代码运行时可用，客户端代码在构建时会被环境遍历的值替换。这通过Webpack的DefinePlugin实现。

一旦环境变量嵌入到客户端代码中，它们就可以通过process.env全局变量来访问。

注意：因为这写变量在构建时进行嵌入，当你改变它们的时候，你需要重启和重构建你的网站。

### 定义客户端环境变量

你可以在根目录定义.env.development或.env.production文件。

除了在.env.*中的环境遍历，你还可以定义定义OS Env变量，OS Env变量中以GATSBY_开头的可以在客户端浏览器代码中访问。

```js
//gatsby-config.js
process.env.SECRET = 'my_secret';
process.env.GATSBY_DISK_API = 'disk_api';
// 浏览器中仅GATSBY_DISK_API可访问
```

### Node.js环境变量

Gatsby在构建时运行若干个Node.js的脚本，明显的是gatsby-config.js和gatsby-node.js脚本。你可以按照常用的方式来添加环境变量。

```js
MY_ENV_VAR=foo npm run develop
```

在node中使用这些变量，需要下面的代码：

```js
// gatsby-config.js
require('dotenv).config({
    path: `.env.${process.env.NODE_ENV}`
})
```

### 保留的环境变量

NODE_ENV，PUBLIC_DIR。因为其它工具会用到。

ENABLE_GATSBY_REFRESH_ENDPOINT。

### 构建时变量

Gatsby在构建步骤中使用额外的环境变量来调整构建结果。eg：添加CI=true的环境变量，Gatsby会根据环境定制终端输出(去掉终端的进度条)。

Gatsby根据物理CPU数量，来调整最佳并行级别。在虚拟机中，可以使用GATSBY_CPU_COUNT的环境变量来并行度。

## 路由和页面

因为许多工作已经在构建时完成，所以Gatsby的网站速度很快。

### 创建页面

路由可以通过三种方式创建：

1、在src/pages中添加React组件（注意：必须export default组件）。

2、使用File System Route API和GraphQL来创建页面。

3、在gatsby-node.js中使用createPages方法（插件也可以实现createPages来创建页面）。

### 在src/pages中定义routes


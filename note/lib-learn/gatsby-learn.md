# Gatsby.js文档

Gatsby是一个为React打造的快如闪电的现代化站点生成器。

## 快速开始

### 使用Gatsby-CLI

安装gatsby-cli

```js
npm i gatsby-cli -g
```

创建站点

```js
gatsby new gatsby-site
```

启动开发服务器，gatsby将会启动一个热更新的开发环境，可以通过访问locakhost:8000访问。

```js
gatsby develop
```

构建生产版本，gatsby将会为你站点的生产版本执行一些优化工作，生成静态HTML和预加载的JS代码包。

```js
gatsby build
```

在本地启动生产版本服务器，gatsby会启动一个本地HTML服务器，用于测试你构建的站点。记得先使用gatsby build构建你的站点。

```js
gatsby serve
```

查看CLI指定文档。

```js
gatsby --help
gatsby COMMAND_NAME --help
```

## 设置开发环境

在开发构建你的Gatsby站点之前，你需要首先熟悉一些web的技术：1、熟悉命令行；2、安装Node.js；3、安装Git。

## Gatsby构建步骤

### Gatsby页面

在IDE中打开src目录，你可以看到pages目录，这就是Gatsby页面。

其实Gatsby的每个页面都是一个导出的React组件。

任何在src/pages/*.(js|ts|tsx)的文件会自动变成一个页面。

### Link组件

使用Gatsby的Link组件来处理Gatsby生成的页面跳转。

### 部署Gatsby网站

Gatsby build命令生成了静态的HTML和JS文件，这些文件可以被部署到任何静态资源服务器。

Gatsby Cloud和Surge是两个部署的选项。

## 在Gatsby中使用样式

### 使用全局样式

主要实在gatsby-browser.js中引入全局样式文件。

```js
//gatsby-browser.js
import './src/styles/global.css';
```

### CSS模块

CSS模块因为可以让你更加安全的书写CSS，所以最近比较流行。CSS模块会自动生成独一无二的class和animation名字，所以你不用担心选择器名字冲突。

Gatsby原生支持CSS模块。

```js
import * as ContainerStyles from './styles/container.module.css';
```

### CSS-in-JS

面向组件的样式组织方式，一般是用JS内联书写CSS。

### 其它CSS选项

Gatsby也支持Sass，JSS，Stylus，PostCSS，Typography.js等CSS技术。

```bash
npm i sass gatsby-plugin-sass --save-dev
```

```js
// gatsby-config.js
plugins: ['gatsby-plugin-sass']
```


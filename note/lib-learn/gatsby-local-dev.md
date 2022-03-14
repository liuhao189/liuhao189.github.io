# Gatsby本地开发 & 路由和页面

## 环境变量

所有的项目和OS环境变量只在构建时可用或Node.js运行时。它们不应该在客户端代码运行时可用，客户端代码在构建时会被环境变量的值替换。这通过Webpack的DefinePlugin实现。

一旦环境变量嵌入到客户端代码中，它们就可以通过process.env全局变量来访问。

注意：因为环境变量在构建时被嵌入，当你改变它们的时候，你需要重启和重构建你的网站。

### 定义客户端环境变量

你可以在根目录定义.env.development或.env.production文件。

除了在.env.*中的环境变量，你还可以定义OS Env变量，OS Env变量中以GATSBY_开头的可以在客户端浏览器代码中访问。

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

在node中使用这些变量.env.*中的环境变量，需要下面的代码：

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

Gatsby在构建步骤中使用额外的环境变量来调整构建结果。eg：添加CI=true的环境变量，Gatsby会根据环境定制终端输出(比如去掉终端的进度条)。

Gatsby根据物理CPU数量，来调整最佳并行级别，在VM中，可以使用GATSBY_CPU_COUNT的环境变量来设置并行度。

## 路由和页面

因为许多工作已经在构建时完成，所以Gatsby的网站速度很快。

### 创建页面

路由可以通过三种方式创建：

1、在src/pages中添加React组件（注意：必须export default组件）。

2、使用File System Route API和GraphQL来创建页面。

3、在gatsby-node.js中使用createPages方法（插件也可以实现createPages来创建页面）。

### 在src/pages中定义routes

每一个在src/pages里的js文件都会生成网页，这些页面的路径跟文件路径一致。

如果文件以index.js命名，文件名称会被命名为上级文件夹名称。

### 使用File System Route API

你还可以基于nodes的列表创建多个页面。

```bash
# src/pages/products/{Product.name}.js 
```

### 使用gatsby-node.js

如果需要更多的控制，eg：通过pageContext传递数据或修改path，你可以使用Gatsby Node APIs。

具体可以参见markdown文件生成页面的例子。

### 路由冲突

当生成的页面path一致时，Gatsby会在构建时生成一个警告，但是编译依然会成功。后面的页面会覆盖前面的页面。

### 嵌套路由

可以在src/pages中添加文件夹目录结构来反映多级的URL。

### 页面间通过Link跳转

为了在页面之间跳转，你可以使用gatsby-link。使用gatsby-link可以给你性能优势（预加载和前端路由）。

另外，也可以通过a标签来跳转，这会重新刷新整个页面。

Gatsby在大多数情况下会记录滚动的位置。

### 性能和预取资源

为了提高性能，Gatsby会在当前页面预取link对应的资源。经过测试，Gatsby在鼠标hover到Link时，就开始预取。

## 通用布局组件

你可以学到如何创建和使用布局组件，怎样避免布局组件卸载和重渲染。

通用布局组件是什么？通用布局组件是跨多个页面共享的组件。

推荐在src/components里创建布局组件。

然后按常规组件引入布局组件使用即可。

### 怎么防止布局组件重新渲染

Gatsby默认情况不控制，当顶级组件在页面间变化时，React会整个重现渲染。这意味着共享的组件会unmout和remount。这会破坏CSS过度效果和清空组件内部的React状态。

你可以设置一个在页面间包裹的组件，这个组件在页面跳转时，不会被unmounted。主要通过Browser API的wrapPageElement来实现。

另外你也可以使用gataby-plugin-layout来避免布局组件unmounted，这个插件替你实现了wrapPageElement API。

### WrapPageElement

主要是在gatsby-browser.js里增加wrapPageElement的导出。

```js
export const wrapPageElement = (apiContext, pluginOptions) => {
  console.log('apiContext', apiContext);
  console.log('pluginOptions', pluginOptions);
  return (<WrapElement {...apiContext.props}>{apiContext.element}</WrapElement>);
}
```

# 样式

有很多种方式向你的网站添加样式，可以通过Global CSS，Modular Stylesheets，CSS-in-JS，这些Gatsby都支持。

### 共享组件中添加CSS

共享布局组件主要是在页面间共享的组件，包括样式，头组件和其它公共组件。

```js
//src/components/layout.js
import React from "react"
import "./layout.css"; //全局样式文件
export default function Layout({ children }) {
  return <div>{children}</div>
}
```

### 在gatsby-browser.js中添加全局CSS

```js
import "./src/styles/global.css"
```

### 在组件中引入CSS

直接引用即可。

### CSS的缺陷

主要是名字冲突和无意识的继承CSS属性的问题，BEM等可以部分解决这个问题，但是CSS Modules和CSS-in-JS是更好的方案。

## CSS Modules

组件作用域的CSS可以允许你在没有副作用的情况下书写传统CSS，不用担心选择器冲突或影响其它组件。

Gatsby默认就支持CSS Modules。

### 什么是CSS Modules

CSS模块非常流行，因为它可以生成独一无二的class和animation名字，同时可以让你在JS对象中访问这些名字。

```js
import * as  ContainerStyles from './styles/wrap-page.module.css';
```

### 什么时候使用CSS Modules

CSS Module强烈推荐使用。因为这可以让你编写常规的，可复用的CSS文件，同时只打包需要的CSS可以获得性能提升。


## CSS-in-JS来增强样式

CSS-in-JS指的是通过JS来书写样式，而不是通过额外的CSS文件。这样可以很方便做到组件作用域，避免未使用的样式代码，更好的性能（没有CSS选择器），更好地动态修改样式。

组件层面：你必须使用组件来添加样式，契合了React的所有都是组件的理念。

作用域：组件内作用域。

动态：样式可以更方便得跟随组件状态变化。

类库：许多CSS-in-JS的类库会生成独一无二的className，自动添加浏览器厂商的前缀，懒加载CSS等功能。

gatsby默认不支持CSS-in-JS，需要引入第三方库。

## 使用Sass

安装gatsby-plugin-sass和sass。

```bash
npm i sass gatsby-plugin-sass --save-dev
```

在gatsby-config.js中包括插件。

```js
plugins:['gatsby-plugin-sass']
```

# 添加本地图片和媒体资源

两种方式来引入资源文件：1、直接在gatsby引用模板，页面和组件中引用；2、使用static folder，在某些场景下比较有用。

## 在webpack中引入资源

可以在JS模块中使用import来引入一个文件，import的结果为文件最终的路径。这个路径可以作为src，href的值。

对于svg、jpg、jpeg、png、gif、mp4、webm、wav、mp3、m4a、acc和oga文件，为了减少额外的服务器请求，import的页面少于10000字节会直接返回一个Data URI而不是path。

```js
import girlImg from './../images/girl.jpeg';
// 这段代码会让webpack将image文件拷贝到public文件夹，同时提供正确的path。
```

也可以在CSS中import文件。

```css
background-image: url("./../images/girl.jpeg")
```
webpack会找到所有的在CSS中的相对引用(以./开始的)，然后将最终的路径替换下。文件路径中webpack会自动添加内容hash值。

如果你使用scss，import是相对于与入口scss文件的。

## 使用GraphQL和gatsby-source-filesystem来查询文件

你可以使用GraphQL来import文件，这也会导致将这些文件拷贝到public文件夹。

```js
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
const DownloadsPage = () => {
  const data = useStaticQuery(graphql`
    {
      allFile(filter: { extension: { eq: "pdf" } }) {
        edges {
          node {
            publicURL
            name
          }
        }
      }
    }
  `)
  return (
    <Layout>
      <h1>All PDF Downloads</h1>
      <ul>
        {data.allFile.edges.map((file, index) => {
          return (
            <li key={`pdf-${index}`}>
              <a href={file.node.publicURL} download>
                {file.node.name}
              </a>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}
export default DownloadsPage
```

## 使用Gatsby Image来避免图片过大

安装gatsby-transformer-sharp和gatsby-plugin-sharp来转换和处理图片。

gatsby-image包含一个组件，它内部支持Gatsby的GraphQL查询。它将Gatsby的原生图片处理能力和图片加载技术结合起来。

gatsby-image并不总能替换<img/>，它需要固定宽高的图片，或充满父级元素的图片。

gatsby-image：

1、使用IntersectionObserver API来懒加载图片。

2、image的位置不会在图片加载过程中变动，主要是因为固定宽高。

3、可以使用占位符图片，一个灰色的背景或模糊不清的图片。

```bash
npm i gatsby-transformer-sharp gatsby-plugin-sharp gatsby-image
```

### 图片的问题

大的，没有优化的图片会减慢你的网站，降低用户体验。

你需要做的工作很多：

1、调整大图到你设计的大小。

2、为智能手机或平板生成许多小尺寸的图片。

3、压缩jpeg和png。

4、懒加载图片以提高首屏时间和减少流量损耗。

5、使用图片占位符，在图片加载时展示部分信息。

6、固定图片的位置，以免图片加载后布局大变动。

这些会耗费大量的人力。

### 解决方案






## 参考文档

https://v2.gatsbyjs.com/docs/how-to/routing/


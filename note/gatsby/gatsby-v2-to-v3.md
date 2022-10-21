# Gataby V2迁移到V3

## 简介

Gataby包括的一系列的重大更改。

## 迁移表格

### 更新你的依赖

首先，需要更新你的依赖。

```json
{
    "dependencies": {
        "gatsby": "^3.0.0"
    }
}
```

然后，更新Gatsby相关的包。你应该更新所有以Gatsby开头的包，注意：这只应该包括在gatsbyjs/gatsby代码仓库中的包。

社区的插件，可能不需要更新也可以正常工作。

如果你看到下列警告：

```bash
warning Plugin gatsby-plugin-acme is not compatible with your gatsby version 3.0.0 - It requires gatsby@^2.32.0
```

这需要插件更新它的peerDependencies来包含gatsby的新版本。大多数情况，插件还可以正常工作。使用npm7时，你可以传递--legacy-peer-deps来忽略这个警告。

### 更新插件的依赖

取决于插件作者如何声明依赖，比如说将依赖声明为PeerDependency或在内部直接声明依赖。如果你遇到这种情况，推荐使用Yarn resolutions。

### 处理版本不匹配

当旧项目中存在node_modules或package-lock.json文件时，你可能会遇到版本不匹配的问题。快速的解决办法是删除node_mdoules和package-lock.json，然后执行npm install。

## 处理重大更改

### 最低的node版本是12.13.0

因为node 10已经接近了维护终止日期。

### webpack从4升级到5

### ESLint从6升级到7

如果使用Gataby的默认ESLint规则，应该没问题。如果使用自己的ESLint配置，请阅读ESLint从6到7的相关升级内容。

### src/api是保留的目录

Gatsby 3.7引入了函数。在src/api/*里的任意JS或TS文件会映射为函数路由。如果你之前有src/api目录，应该换一个名字。

### Gatsby link组件

gatsby的push，replace和naviagteTo在V3中已经移除，请使用navigate方法。

```ts
import { naviagte } from 'gatsby';
// import { navigateTo, push, replace } from "gatsby"
// 上面的已经移除
```

### 移除了__experimentalThemes

gatsby-config.js中的__experimentalThemes已经移除。你需要在插件数组中声明gataby themes。

```ts
module.exports = {
- __experimentalThemes: ["gatsby-theme-blog"]
+ plugins: ["gatsby-theme-blog"]
}
```

### pathContext被移除

你需要使用pageContext来在页面中获取gataby-node的数据。

### boundActionCreators被移除

boundActionCreators被移除，需要使用actions变量，actions中有相同的行为。

```ts
exports.createPages = (gatsbyArgs, pluginArgs) => {
- const { boundActionCreators } = gatsbyArgs
+ const { actions } = gatsbyArgs
}
```

### deleteNodes被移除

需要遍历nodes，然后依次执行delteNode(node)。

```ts
const nodes = ["an-array-of-nodes"]
- deleteNodes(nodes)
+ nodes.forEach(node => deleteNode(node))
```

### createNodeField中移除fieldName或fieldValue

请使用name和value来替代。

```ts
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  createNodeField({
    node,
-   fieldName: "slug",
-   fieldValue: "my-custom-slug",
+   name: "slug",
+   value: "my-custom-slug",
  })
}
```

### 移除hasNodeChanged

这个API已不再需要，因为有内部的检查方法。

### images查询移除sizes和resoltions

需要使用fluid和fixed。

```tsx
import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

const Example = ({ data }) => {
  <div>
-    <Img sizes={data.foo.childImageSharp.sizes} />
-    <Img resolutions={data.bar.childImageSharp.resolutions} />
+    <Img fluid={data.foo.childImageSharp.fluid} />
+    <Img fixed={data.bar.childImageSharp.fixed} />
  </div>
}

export default Example

export const pageQuery = graphql`
  query IndexQuery {
    foo: file(relativePath: { regex: "/foo.jpg/" }) {
      childImageSharp {
-        sizes(maxWidth: 700) {
-          ...GatsbyImageSharpSizes_tracedSVG
+        fluid(maxWidth: 700) {
+          ...GatsbyImageSharpFluid_tracedSVG
        }
      }
    }
    bar: file(relativePath: { regex: "/bar.jpg/" }) {
      childImageSharp {
-        resolutions(width: 500) {
-          ...GatsbyImageSharpResolutions_withWebp
+        fixed(width: 500) {
+          ...GatsbyImageSharpFixed_withWebp
        }
      }
    }
  }
`
```

### 通过node id来调用touchNode

需要传递完整的node来调用touchNode。

```ts
exports.sourceNodes = ({ actions, getNodesByType }) => {
  const { touchNode } = actions

- getNodesByType("YourSourceType").forEach(node => touchNode(node.id))
+ getNodesByType("YourSourceType").forEach(node => touchNode(node))
}
```

### 通过node id来调用delteNode

需要传递完成的node来调用delteNode。

```ts
exports.onCreateNode = ({ actions, node }) => {
  const { deleteNode } = actions

- deleteNode(node.id)
+ deleteNode(node)
}
```

### gatsby-browser移除三个API

getResourcesForPathnameSync => loadPageSync

getResourcesForPathname => loadPage

replaceComponentRender => wrapPageElement

### 使用全局的graphql标签来查询

你需要使用从gatsby来引入graphql来执行查询。

```ts
import React from "react"
+ import { graphql } from "gatsby"

const Page = ({ data }) => (
  <div>Show my data: {JSON.stringify(data, null, 2)}</div>
)

export default Page

export const query = graphql`
  {
    site {
      siteMetadata {
        description
      }
    }
  }
`
```

### CSS Modules被转换为ES Modules

ES Modules允许更好的treeshake，产生更小的包。现在可以使用import { box } from './mystyles.module.css'。

```ts
import React from "react"
- import styles from './mystyles.module.css'
+ import { box } from './mystyles.module.css'

const Box = ({ children }) => (
-  <div className={styles.box}>{children}</div>
+  <div className={box}>{children}</div>
)

export default Box
```

也可以使用import * as styles的语法引入，但这样webpack不会treeshake你的样式。

如果你使用传统的CSS Modules，需要安装gatsby-plugin-postcss来覆盖默认配置。

下面的代码覆盖了Sass，其它plugins也有相同的cssLoaderOptions属性。

```ts
module.exports = {
  plugins: [
-    `gatsby-plugin-sass`,
+    {
+      resolve: `gatsby-plugin-sass`,
+      options: {
+       cssLoaderOptions: {
+         esModule: false,
+         modules: {
+           namedExport: false,
+         },
+       },
+     },
+    }
  ]
}
```

### 文件(fonts,pdfs)会被导入为ES Modules

文件资源会被处理为ES Modules，确保将require函数切换为imports。

```ts
import React from "react"
import { Helmet } from "react-helmet";
+ import myFont from '../assets/fonts/myfont.woff2'

const Layout = ({ children }) => (
  <div>
    <Helmet>
-      <link rel="preload" href={require('../assets/fonts/myfont.woff2')} as="fonts/woff2" crossOrigin="anonymous" type="font/woff2" />
+      <link rel="preload" href={myFont} as="fonts/woff2" crossOrigin="anonymous" type="font/woff2" />
    </Helmet>
    {children}
  </div>
)

export default Layout
```

如果你使用含表达式的require或require.context，你需要添加.default来让require语句正常工作。

```ts
import React from "react"
import { Helmet } from "react-helmet";

const Layout = ({ children, font }) => (
  <div>
    <Helmet>
-      <link rel="preload" href={require('../assets/fonts/' + font + '.woff2')} as="fonts/woff2" crossOrigin="anonymous" type="font/woff2" />
+      <link rel="preload" href={require('../assets/fonts/' + font + '.woff2').default} as="fonts/woff2" crossOrigin="anonymous" type="font/woff2" /
    </Helmet>
    {children}
  </div>
)

export default Layout
```
### webpack5的node配置变更

一些组件需要你在浏览器中polyfill或disable node的API。eg：path，fs。webpack5移除了自动polyfills，你需要手动设置。

```ts
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
-    node: {
-      fs: "empty",
-      path: "mock",
-    },
+    resolve: {
+       alias: {
+          path: require.resolve("path-browserify")
+       },
+       fallback: {
+         fs: false,
+       }
+    }
  })
}
```

如果这不起作用，你需要根据具体的错误消息来解决该问题。

### process未定义

webpack4将process自动polyfill，但是webpack5并不这样做。

如果你使用process.browser在你的组件中，你可以切换到判断window是否undefined。

```ts
import React from "react"

const Base64 = ({ text }) => {
  let base64;
-  if (process.browser) {
+  if (typeof window !== "undefined") {
    base64 = btoa(text)
  } else {
    base64 = Buffer.from(text).toString('base64')
  }

  return (
    <div>
      {base64}
    </div>
  )
}

export default Base64
```

如果你使用其它的process属性，你可以安装process npm包。

```ts
// npm install process
exports.onCreateWebpackConfig = ({ actions, stage, plugins }) => {
  if (stage === 'build-javascript' || stage === 'develop') {
    actions.setWebpackConfig({
      plugins: [
        plugins.provide({ process: 'process/browser' })
      ]
    })
  }
}
```

### JSON引入跟JSON modules的web规范

JSON的模块引入只允许引入默认导出的内容，不允许子内容了。

```ts
import React from "react"
- import { items } from "../data/navigation.json"
+ import navigationData from "../data/navigation.json"

const Navigation = () => (
  <nav>
    <ul>
-      {items.map(item => {
-        return <li><a href={item.to}>{item.text}</a></li>
-      })}
+      {navigationData.items.map(item => {
+        return <li><a href={item.to}>{item.text}</a></li>
+      })}
    </ul>
  </nav>
)

export default Navigation
```

### webpack弃用消息

当使用社区的Gatsby插件时，你可能会在“Building JavaScript”或“Building SSR bundle”阶段，看到[DEP_WEBPACK]的消息。

这通常是因为这些插件跟webpacn5不兼容，需要联系插件的负责人来修复。大部分情况下Gatsby也会正常编译成功。

### 在SSR中使用fs

Gatsby对HTML生成引入了增量编译功能。为了实现这个功能，Gatsby需要跟踪所有影响html文件生成的所有文件。

在gatsby-ssr.js文件中，使用fs模块，会被编辑为不安全，同时关闭增量编译功能。

```ts
import * as React from "react"
-import * as fs from "fs"
-import * as path from "path"
+import stylesToInline from "!!raw-loader!/some-auto-generated.css"

export function onRenderBody({ setHeadComponents }) {
-  const stylesToInline = fs.readFileSync(path.join(process.cwd(), `some-auto-generated.css`))
  setHeadComponents(
    <style
      dangerouslySetInnerHTML={{
        __html: stylesToInline,
      }}
    />
  )
}
```

### 面向插件维护者

plugin的peerDependencies应该包含gatsby的v3版本。

```ts
{
  "peerDependencies": {
-   "gatsby": "^2.32.0",
+   "gatsby": "^3.0.0",
  }
}
//如果支持两个版本，可以使用 ||
{
  "peerDependencies": {
-   "gatsby": "^2.32.0",
+   "gatsby": "^2.32.0 || ^3.0.0",
  }
}
```

## 已知问题

### reach-router

gatsby包含了reach-router来使它可以在React V17上工作。Gatsby增加了一个webpack alias，你可以像往常使用它一样使用。

某些情况下，你会遇到下面的错误。

```bash
Generating development JavaScript bundle failed

Can't resolve '@gatsbyjs/reach-router/lib/utils' in '/c/Users/xxx/test/node_modules/gatsby-link'

If you're trying to use a package make sure that '@gatsbyjs/reach-router/lib/utils' is installed. If you're trying to use a local file make sure that the path
is correct.

File: node_modules/gatsby-link/index.js:24:13
```

为了解决这个错误，确保你更新所有依赖。确保使用gatsby clean来删除旧的.cache文件夹。

某些情况下，webpack alias会被忽略，所以你需要再次添加你的alias。

### webpack EACCES

如果使用windows或WSL，你可能会看到以下的错误。

```ts
Watchpack Error (initial scan): Error: EACCES: permission denied, lstat '/c/DumpStack.log.tmp'
Watchpack Error (initial scan): Error: EACCES: permission denied, lstat '/c/hiberfil.sys'
Watchpack Error (initial scan): Error: EACCES: permission denied, lstat '/c/pagefile.sys'
Watchpack Error (initial scan): Error: EACCES: permission denied, lstat '/c/swapfile.sys'
```

Gatsby会持续关注该问题，请查看https://github.com/webpack/watchpack/issues/187来关注后续的进展。


### yarn workspaces

Workspaces及其对依赖项的提升可能在你想增量更新包时导致麻烦。

eg：如果你在多个包中使用了gatsby-plugin-emotion，但是只想在一个包中更新gatsby-plugin-emotion的版本，这会导致在你的项目中有相同包的多个版本。可以执行yarn why package-name来检查不同的版本安装情况。

我们推荐一次性更新所有的依赖，保持项目中只有包的一个版本。



## 参考文档

https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3/#gatsby-skip-here
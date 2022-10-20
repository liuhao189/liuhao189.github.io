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




## 参考文档

https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3/#gatsby-skip-here
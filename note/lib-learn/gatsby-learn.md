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

主要是在gatsby-browser.js中引入全局样式文件。

```js
//gatsby-browser.js
import './src/styles/global.css';
```

### CSS模块

CSS模块可以让你更加安全的书写CSS，最近比较流行。CSS模块会自动生成独一无二的class和animation名字，所以你不用担心选择器名字冲突。

Gatsby原生支持CSS模块。

```js
import * as ContainerStyles from './styles/container.module.css';
//如果是TS，需要包含global.d.ts
declare module '*.scss';
declare module '*.css';
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

## 创建嵌套布局组件

主要学习Gatsby plugins和创建布局组件。

Gatby的插件一般是一个独立的npm包。Gatsby设计时就考虑到了利用插件来扩展功能，插件几乎可以做任何事。

布局组件主要是书写页面通用模块位置的组件，经常需要跨页面使用。eg：共享的header和footer。

### 使用插件

Gatsby已经有数百个插件，https://v2.gatsbyjs.com/plugins。

插件的使用主要包括两步：1、安装；2、配置。

```js
npm i gatsby-plugin-typography react-typography typography typography-theme-fairy-gates --save-dev
```

然后在gatsby-config.js中添加插件和配置插件。

```js
plugins: [
    {
        resolve: 'gatsby-plugin-typography',
        options: {
            pathToConfigModule: 'src/utils/typography'
        }
    }
]
```

## Gatsby中的数据

深入到Gatsby的数据层，这是gatsby提供的比较强大的功能。可以让你从MarkDown，WorkPress，CMS，或其它数据源中来创建页面。

注意：Gatsby的数据层使用GraphQL。

一个网站有四部分：1、HTML；2、CSS；3、JS；4、Data。

什么是数据？在Gatsby中，在React组件以外的东西都是数据。

之前的教程中，你直接书写文本和添加图片到组件中。但是，在实际项目中，你更多的需要在组件外存储数据。eg：基于WordPress的网站，数据在WordPress中，你拉取数据到需要的组件中。

数据也可以在其它类型的文件中，MarkDown，CSV，DataBase或API。Gatsby的数据层使你可以从这些数据源拉取数据到你的组件中。

### 使用GraphQL

在gatsby-config.js文件中，添加siteMetadata对象。

```js
module.exports = {
    siteMetadata: {
        title: `Title from siteMetadata`
    }
}
```

```ts
import { graphql } from 'gatsby';
export const query = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
    }
`;

export default const About: React.FC = ({ data }) => {
    return (
        <Container>
            <div style={{ 'color': 'red' }}>
                <h1>About {data.site.siteMetadata.title}</h1>
                <h1>I am about component.</h1>
            </div>
        </Container>
    )
}
```

### 使用StaticQuery

StaticQuery是Gatsby V2开始引入的API，StaticQuery可以用于非页面组件。

```ts
import { useStaticQuery, graphql } from 'gatsby';
const Container: React.FC = ({ children }) => {
    const data = useStaticQuery(graphql`
        query {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);
    //...
}
```

## source插件

主要讲怎样使用GraphQL和source插件来把数据添加到你的Gatsby网站中。

### GraphiQL

GraphiQL是GraphQL的集成开发环境。可以通过http://localhost:8000/__graphql来访问。

### source插件

Gatsby网站的数据可以来自任何地方，API，Database，CMS，local files，etc。

Source插件从source获取数据。eg：fs source插件知道如何从文件系统获得数据；Wordpress插件知道如何从WordPress-API来获得数据。

```bash
npm i gatsby-source-filesystem
```

```js
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
```

然后你在GraphQL中就可以看到file和allFile了。

## transformer插件

transformer插件主要用于转换source插件得到的原始内容。

eg：markdown文件，Markdown容易书写，但是分享或发布时，需要转换为HTML。

```bash
npm i gatsby-transformer-remark --save-dev
```

```js
plugins: [
    `gatsby-transformer-remark`
]
```

然后可以使用GraphQL来查询markdown转换后的html。

## 使用API来从Data创建页面

Gstsby允许你在构建时使用GraphQL来查询数据，然后将查询结构map到页面。

为了创建markdown页面，你需要使用两个Gatsby的API，onCreateNode和createPages。

```js
//这会在node中添加slug属性。
exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === 'MarkdownRemark') {

    const { createNodeField } = actions;
    const slug = createFilePath({ node, getNode, basePath: "pages" });
    createNodeField({
      node,
      name: 'slug',
      value: slug
    })
  }
}
```

### 创建template

Gatsby中，使用程序来创建页面也是由React组件驱动的。所以你需要创建一个React组件作为页面模板。

```js
import { graphql } from 'gatsby';
import React from 'react';

interface IMarkdownData {
    markdownRemark: {
        frontmatter: {
            title: string
        },
        html: string
    }
}

const BlogPost: React.FC<{ data: IMarkdownData }> = ({ data }) => {
    const post = data.markdownRemark;
    return (
        <>
            <h1>{post.frontmatter.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
        </>)
}

export default BlogPost;

export const query = graphql`
 query($slug:String!) {
     markdownRemark( fields : { slug : { eq: $slug } }) {
         html 
         frontmatter {
             title
         }
     }
 }
`
```

### createPage API

```js
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.tsx`),
      context: {
        slug: node.fields.slug
      }
    })
  });
}
```

## 准备发布网站

### 创建一个线上build

```bash
gatsby build
#本地启动server
gatsby serve
```
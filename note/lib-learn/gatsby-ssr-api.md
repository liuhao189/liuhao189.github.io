# Gatsby SSR Api & 渲染选项

gatsby-ssr.js可以让你修改被SSR的HTML文件的内容。在项目根目录创建gatsby-ssr.js。

注意：wrapPageElement和wrapRootElement API同时存在于browser API和SSR API，一个文件中使用了，另外一个也要使用。

```js
import React from 'react';
import WrapElement from './src/components/wrap-page';

export const wrapPageElement = ({ element, props }) => {
  return (<WrapElement {...props } > { element } </WrapElement>);
};

export const onRenderBody= ({setBodyAttributes}) => {
  setBodyAttributes({
    className:'my-body-class-changed'
  })
}
```

## onPreRenderHTML

function: (apiCallbackContext:object, pluginOptions: pluginOptions) => undefined

在Gatsby的SSR之外，创建HTML文件之前，你可以修改传递给html.js的内容。

apiCallbackContext属性：

1、pathname，渲染页面的路径。

2、getHeadComponents。

3、replaceHeadComponents。

4、getPreBodyComponents。

5、replacePreBodyComponents。

6、getPostBodyComponents。

7、replacePostBodyComponents。

pluginOptions的属性：

gatsby-config.js的配置。

```js
//
export const onPreRenderHTML= (apiCallbackContext) => {
  const {getHeadComponents,replaceHeadComponents, pathname} = apiCallbackContext;
  const headComponents = getHeadComponents();
  console.log('pathname is ',pathname);
  headComponents.forEach(elem => {
    console.log(elem.key);
    console.log(JSON.stringify(elem));
  });
  replaceHeadComponents([...headComponents,<script key='scriptAdded' dangerouslySetInnerHTML={{ __html: 'console.log("Script added!")' }}></script>])
}
```

## onRenderBody

function: ({apiCallbackContext:object, pluginOptions:pluginOptions}) => undefined

在每一个页面SSR之后，你可以在html.js渲染之前修改head和body组件。

gatsby使用双段渲染。它遍历你的pages，首先渲染body，然后拿着body的HTML字符串传给html.js来完成渲染。

能够将自定义组件发送到html.js很方便。因为有多个插件可以实现这个replaceRenderer，但是只有一个插件可以接管rendering。所以，如果你的插件要接管rendering，使用此API。

apiCallbackContext参数属性：

1、pathname。

2、setHeadComponents。

3、setHtmlAttributes。

4、setBodyAttributes。

5、setPreBodyComponents。

6、setPostBodyComponents。

7、setBodyProps。

## replaceRender

function:({apiCallbackContext:object,pluginOptios:pluginOptions}) => undefined

替换默认的server renderer。对需要集成Redux，css-in-js等需要自定义启动的库很有用。

apiCallbackContext的属性：pathname，bodyComponent，replaceBodyHTMLString，setHeadComponents，setHtmlAttributes，setBodyAttributes，setPreBodyComponents，
setPostBodyComponents，setBodyProps。

## wrapPageElement

function: (apiCallbackContext:object, pluginOptions:pluginOptions)=>ReactNode

主要是设置跨页面的wrapper components。这个组件在页面变更时，不会unmounted。

apiCallbackContext属性：element：gatsby创建的页面的Element，props。

return的值：ReactNode。

## wrapRootElement

function:(apiCallbackContext,pluginOptions)=>ReactNode

允许插件包裹根元素，通常用于设置应用程序范围的Provider组件。

apiCallbackContext属性：element。


# 服务端渲染API

服务器端渲染允许你在客户端运行带有数据的页面。服务器生成完整的HTML页面，然后发送给用户。服务器端渲染API主要关注于在gatsby data layer以外的数据获取。

## 创建Server-Rendered页面

和普通页面基本一样，唯一的区别是页面组件需要export一个getServerData的异步方法。

```js
export async function getServerData(context) {
    return {
        status: 200,
        props: {
          list:
            [
              { id: 1 },
              { id: 2 }
            ]
        }
    }
}
```

当一个页面组件导出getServerData方法，Gatsby将所有由该组件生成的页面都视为Server Rendered。

context包括：1、headers。2、method。3、url。4、query。5、params。

return包括：1、status，2、props。3、headers。

## 和构建时GraphQL查询的相互影响

Server-rendered页面同样支持Gatsby GraphQL页面查询。

注意：data在页面每次渲染都会保持不变，但是serverData会根据getServerData的方法返回的值进行相应变更。

因为每次刷新页面时，getServerData会重新运行。

## 本地运行Server-rendered页面

Server-rendered页面会在gatsby develop和gatsby serve中运行。每次请求都会生成新的页面。

## 在production中使用

服务端渲染需要NodeJS服务器，你可以简单得使用gatsby serve来搭建一个服务器。但是你需要自己关注监控，日志，崩溃恢复等工作。

使用开箱即用且可以弹性扩容的gatsby-cloud是比较好的方案。

## 怎么工作的

每一次请求过来，服务器会运行getServerData，然后将这个数据传递给React组件，然后返回HTML给用户。默认情况下是没有缓存的，你可以自己设计Cache-Control头。

当你直接访问页面时，你会得到HTML。如果你通过Gatsby的Link组件访问，响应会是JSON，Gatsby-route会用这个在客户端渲染页面。

你只需要做的是在页面组件中定义一个getServerData方法，其它的框架会替你完成。

# 拓展阅读-渲染选项

Rendering选项定义了在哪个阶段页面的HTML会被生成。可以在build时（SSG pre-rendering），在HTTP请求时（Server Side Rendering），在本地（Client-Side rendering）。

gatsby一直支持SSG（Static Site Generation）和Client-Side渲染，现在，另外两个其它渲染选项也被支持。DSG（Deferred Static Generation）和SSR（Server Side Rendering）。

## SSG

Static Site Generation是gatsby中的默认渲染模式。这意味着整个网站会在build时生成预渲染的HTML，CSS和JS。由于是预构建的静态资源，后续请求不涉及大量计算，该方式是响应最快的方式。

怎么工作的？

1、首先，gatsby在构建时生成所有SSG页面需要的静态资源。

2、然后，静态资源上传到CDN。

SSG的一个缺点是，较长的构建时间。当页面增加时，构建时间也会增加。

Gatsby为了解决这个问题，添加了增量构建的功能，来确保只构建改变的页面。

## DSG

DSG在概念上和SSG极为相似，唯一的区别是DSG模式下，开发者可以选择懒构建相关的页面。只有用户第一次请求时，才构建相关的页面。

举个例子：你有一些老旧的博客文章不再有用户访问，每次构建时不必每次都生成那些老旧的博客页面。

DSG需要你在构建完成后，依然保持build Server可用。

## SSR

SSG，DSG和客户端渲染可以适应大多数网站的场景。但是有些情况下，你还是需要服务器渲染。

每次请求到来时，Gatsby都会执行页面组件的getServerData方法，你可以使用context来控制Http的header，以此来规定CDN的缓存策略。




## 参考文档

https://v2.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/


https://www.gatsbyjs.com/docs/reference/rendering-options/server-side-rendering/
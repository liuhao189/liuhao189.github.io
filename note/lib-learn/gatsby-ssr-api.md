# Gatsby SSR Api

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



## 参考文档

https://v2.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
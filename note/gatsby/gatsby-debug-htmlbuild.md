# Gataby-调试HTML-构建过程

在生成静态HTML文件(React构建时SSR或getServerData运行时SSR)可能会发生错误。

常见的错误原因：

1、你的代码引用了Browser全局变量(window或document)，这些变量在NodeJS中不可用。你可以看到类似“window is not defined”的错误，你可以在调用之前判断下环境。

如果代码在一个React的组件的render方法中，将代码转移到componentDisMount或useEffect hook中，这可以确保代码只在浏览器中执行。

2、检查在pages（包括子文件夹）下面的JS文件都导出了React组件或字符串。

3、在同一个文件中混用import和require。这可能导致WebpackError。解决方法是指使用import。这也适用于getaby-ssr和gatsby-browser文件。

4、你的app没有在客户端正确的hybrate。这会导致gatsby-develop和gatsby-build不一致。

## 怎样检查window未定义

```js
const isBrowser = typeof window !== undefined;

export default function MyComponent() {
  let loggedIn = inBrowser ? localstorage.getItem('isLoggedIn') : false;
  return (
    <div> I am {loggedIn ? 'logged' : 'un-logged'} </div>
  )
}
//引用模块时
if(inBrowser) {
  //module's code tried to reference window
  const module = require('module');
}
//
```

## 修复第三方包

最糟糕的情况是你引用的npm包引用了window等BrowserAPI。你可以提一个issue等待官方修复。更好的作用是通过修改webpack配置使module在SSR期间替换为“仿制品”。

```js
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  //
  if(stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          test: /bad-module/,
          use : loaders.null(),
        ]
      }
    })
  }
}
```

另外一个解决方案是使用loadable-components。这个模块在浏览器环境下懒加载模块，在SSR时不会加载模块。
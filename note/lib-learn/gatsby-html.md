# 自定义Gatsby html.js

gatsby使用一个React组件来服务端渲染<head>和页面的其它部分。

大多数网站都应该使用默认的html.js。如果你想自定义html.js，首先需要先把默认的html.js拷贝到src目录下。

```bash
cp .cache/default-html.js src/html.js
```

如果你想在每个页面的head和footer插入自定义元素，你可以使用html.js。

注意：如果gatsby-ssr.js的API无法完成你的需求，才应该考虑修改html.js。

## 必须的属性

很多属性是必须的。eg：headComponents，preBodyComponents，body和postBodyComponents。

## 在head中插入HTML

在html.js组件中渲染的DOM是静态的。如果你需要动态修改head内的元素，推荐React Helment。

## 在footer中插入HTML

如果你想在footer中插入HTML，html.js是比较好的方式。

注意：如果写插件，可以考虑setPostBodyComponents属性。

## 挂载元素

如果你看见"Uncaught Error: _registerComponent(...): Target container is not a DOM element"，这通常意味着你的html.js的body里没有id为__gatsby的元素。

## 添加JS脚本

你可以使用React的dangerouslySetInnerHTML属性添加自定义JS脚本到你的HTML文档中。

```js
<script dangerouslySetInnerHTML= {{
  __html: `
    var name = 'world';
    console.log('Hello ' + name);
  `
}}>
```
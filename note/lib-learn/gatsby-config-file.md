# Gatsby配置文件

在配置文件中，gatsby提供了一系列API来控制Gatsby的启动，构建，客户端运行时的行为。这允许添加数据源，创建页面，修改生成的页面。

## Gatsby-config API

Gatsby-config定义网站的metadata，插件，其它配置。Gatsby-config应该导出一个Object。

配置属性有：

1、siteMetadata:object。

如果想在整个网站的多个页面之间复用一些通用数据，你可以在siteMetadata中存储数据。这些数据在组件中可以使用GraphQL来获取数据。

2、plugins:[]。

plugin是实现了Gatsby API的npm包。可以简单添加plugin的名称，如果要配置plugin，则需要声明为对象模式。

3、flags。

flags可以允许开启实验性或即将到来的新功能，主要用于功能和特性配置。

4、pathPrefix。

如果site不部署到域名的根目录，可以设置一个子目录。eg:www.xxx.com/blogs/，需要配置pathPrefix: 'blogs/'。

5、polyfill。

Gatsby中使用了ES6的Promise API。一些老旧浏览器不支持，所以gatsby默认包含了Promise的polyfill。设置为false，可以禁用。

6、mapping。

创建在node类型中的mapping关系。

7、proxy。

主要是在开发时设置代理。

```js
module.exports = {
  proxy: {
    prefix: '/api',
    url: 'https://examplesite.com/api/'
  }
}
```

8、developMiddleare。

一些时候，你需要更加细粒度和更灵活的配置dev server。Gatsby暴露了Express.js服务器接口。


## Gatsby Node API

文件位置：根目录的gatsby-node.js文件。

在构建process中会运行一次。你可以使用它来动态创建页面，在GraphQL中添加nodes，或响应build的生命周期方法。

如果你的方法是异步操作(文件IO，DB访问，调用远程接口)，你需要返回Promise，或使用callback参数（第三个参数）。

```js
// Async/await
exports.createPages = async () => {
  // do async work
  const result = await fetchExternalData()
}
// Promise API
exports.createPages = () => {
  return new Promise((resolve, reject) => {
    // do async work
  })
}
// Callback API
exports.createPages = (_, pluginOptions, cb) => {
  // do async work
  cb()
}
```
### APIS
#### createPages

主要是添加页面。在数据源插件和转换插件运行后执行，你可以在页面中查询数据。

参数：actions：{ createPages }，graphql，reporter。

return：void，但是可以返回Promise。


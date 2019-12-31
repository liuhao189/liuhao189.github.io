# single-spa学习笔记

# JS微前端框架

single-spa是一个可以将多个前端应用整合到一个前端应用的框架。有一下收益：

1、不刷新的情况下使用多种框架(React、AngularJS、Angular、Vue...)

2、单独部署你的前端应用

3、单独升级你的前端应用

4、代码懒加载

## Examples

[simple-single-spa-webpack-example](https://github.com/joeldenning/simple-single-spa-webpack-example)

## 架构概览

single-spa受到现代组件系统启发，整个应用应用生命周期。考虑到JS 的框架众多，single-spa可以让您使用任何框架。

Applications，每一个都是一整个 SPA。每个应用需要对url 改变进反应，同时暴露bootstrap，mount 和 unmount 生命周期方法。传统的 SPA 和 single-spa 的 SPA 的主要区别在于：single-spa 的 spa 必须和其它应用共存；single-spa的应用没有自己的HTML页面。


single-spa主页面，包括 HTML页面和注册应用的 JS 脚本。每一个应用注册三种类型：名称；加载应用代码的函数；应用是否是活跃状态的函数。

single-spa 可以工作在几乎构建框架和应用框架上。可以使用 npm安装，可以使用 script 标签引用。


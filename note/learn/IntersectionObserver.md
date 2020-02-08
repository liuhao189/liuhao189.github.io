# Intersection Observer

# 简介

Intersection Observer API 提供了一种异步观察目标元素与祖先元素或顶级文档 viewport 的交集中变化的方法。

一直以来，检测元素的可视状态或两个元素的相对可视状态都不是一件容易的事，大部分解决办法并非完全可靠，也极易拖慢整个网站的性能。然而，随着网页发展，对上述检测的需求也随之增加。

比如：

1、当页面滚动时，懒加载图片或其它内容。

2、实现可无限滚动网站，也就是当用户滚动网页时直接加载更多内容，无需翻页。

3、为计算广告收益，检测其广告元素的曝光情况。

4、根据用户是否已滚动到相应区域来灵活开始执行任务或动画。

过去，交集检测通常需要涉及到事件监听，以及每个目标元素执行 Element.getBoundingClientRect 方法以获取所需信息。缺点：这些代码在主线程上运行，任何一点都可能造成性能问题；网页遍布这些代码比较丑陋。

Intersection Observer API会注册一个回调方法，每当期望被监视的元素进入或退出另一个元素该回调方法将会被执行，或者两个元素的交集部分大小发生变化的时候回调方法也会被执行。

Intersection Observer API 不能告诉我们重叠部分的准确像素个数或者重叠的像素属于哪一个元素。

# Intersection observer 概念和用法

Intersection Observer API 允许你配置一个回调函数，每当目标元素与设备视窗或者其它指定元素发生交集的时候执行。

设备视窗或其它元素我们称它为根元素或 root，通常，您需要关注文档最接近的可滚动祖先元素的交集更改。

目标元素和根元素直接的交叉度就是交叉比，这是目标元素相对于根元素的交集百分比的表示。

## 创建一个 intersection observer

创建一个 IntersectionObserver 对象，并传入相应参数和回调用函数。

``` js
// root 指定根元素，必须是目标元素的父级元素，未指定或为 null，则默认为浏览器视窗。
// rootMargin root 元素的外边距，计算交集的区域范围
// threshold 可以是单一的数值或 numbers 数组，单一的数值表示可见性超过x%就执行回调，[0,0,25,0.5,1]表示达到每个数字就会执行一次回调，默认为 0。
let options = {
    root: document.querySelector('#app'),
    rootMargin: '20px',
    threshold: [0, 0.25, 0.5, 1]
}
let observer = new IntersectionObserver(callback, options);
//
function callback() {

}
```

## 为观察者配置一个目标

```js
```


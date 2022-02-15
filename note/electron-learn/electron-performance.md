# Electron-性能篇

软件工程师，用户和框架开发者并不总是就性能的定义达成一致。此文概述了Electron维护者最喜欢的减少内存使用、CPU负载以及磁盘资源使用的方式，以确保您的应用程序能够响应用户输入并尽快完成操作。

如何使用JS构建高性能网站的方法通常也适用于Electron应用程序。某些程度上，讨论如何构建高性能Node.js应用的方法同样也适用。

下面只是列表了一些直接的，易于实现的方式。如果你想构建性能最优秀的应用，你需要仔细检查应用中的所有代码，认真地进行分析和衡量，瓶颈在哪里？

最成功的策略是分析正在运行的代码，查找其中最耗资源的部分，然后对其进行优化。一遍又一遍地重复这个过程，将极大地提高应用程序的性能。

## 检查列表

### 1、谨慎地加载模块

当你添加一个Node.js模块时，请检查这个模块。这个模块包含了多少依赖？简单的一个require声明中包含了什么种类的资源？

真实的案例：远古的机器上，isOnline的方法，依赖过多且过大，导致耗时多。

某些模块运行在服务器上很好，但是运行在Electron中就不是很合适。Electron不应该将不需要的信息加载、解析和存储到内存中。

添加一个模块时，建议做以下的检查：

1、包含的依赖项的大小。

2、需要加载的require的资源。

3、你所加载的资源能够执行你关心的操作。

可以使用命令行命令生成CPU和堆内存的相关信息文件。

```bash
node --cpu-prof --heap-prof -e 'require('fs')';
```

## 过早地加载和执行代码

如果你有非常繁重的初始化操作，请考虑推迟进行。传统的Node.js开发中，习惯将所有的require语句放在代码顶部，这在Electron中是不对的。最好延迟加载。

### 为什么

加载模块是令人吃惊的繁重的操作，尤其是在windows上，当你的应用启动时，不应该让用户等待当时不需要的操作。

VSCode的例子：当你打开一个文件，它会立刻展示没有高亮任何代码的内容，优先实现和文本交互的功能。一旦实现这些功能后，再加载高亮的模块。

### 怎么做

当你需要的时候才分配资源，而不是在你的应用启动时分配所有资源。

## 阻塞主进程

Electron的主进程（有时叫浏览器进程）非常特殊，它是你应用中所有其它进程的父进程，也是和操作系统交互的关键进程。

在任何情况下都不应该阻塞此进程或运行时间较长的用户界面线程。阻塞UI线程意味着您的应用程序将冻结直到主进程准备好继续处理。

### 为什么

主进程和它的UI线程是应用内操作的控制塔。当操作系统告诉你的应用鼠标点击时，主进程会先接收到消息。如果你的窗口呈现动画，它需要和GPU进程进行通信，这会再次传过主进程。

### 怎么做

Electron强大的多进程架构随时准备帮助你完成你的长期任务。但也有一些性能陷阱。

1、对于需要长期占用CPU的繁重任务，使用worker threads，考虑将它们移动到BrowserWindow或生成一个专用进程。

2、尽可能避免使用同步IPC和remote模块，使用remote时非常容易不知情地阻塞UI线程。

3、在主线程中，尽量减少同步阻塞操作。当模块提供一个同步或异步版本时，你应该使用异步的API。

## 阻塞渲染进程

你的应用可能有很多JS在渲染过程中运行，有个技巧是尽快执行操作，而不占用保持滚动平滑，响应用户输入或60帧动画所需的资源。

### 怎么做

对于小的操作使用requestIdleCallback，而长时间运行的操作使用Web Workers。

requestIdleCallback允许开发者将函数排队为进程进入空闲期后立刻执行。

## 不必要的polyfills

Electron的一大好处是，你准确得知道哪个引擎将解析你的JS，HTML和CSS。

### 为什么

面向浏览器的应用环境，最老的环境决定了你能够和不能使用的功能。Electron中基本上不存在这种问题。所以一些polyfill可以去掉。

### 怎么做

使用caniuse网站来查询是否原生支持某些特性。另外，仔细检查是否真的需要该npm包？

如果使用TS，请检查target是否是较新的ECMAScript标准。

## 不必要或阻塞的网络请求

避免从互联网获取几乎不变化的资源，如果它可以轻松地与你的应用程序捆绑起来。

### 为什么

Web的应用程序开发者习惯了各种内容从CDN获取。举个例子：谷歌字体，网页中可以通过几行CSS来加载。

但是构建Electron应用程序时，如果字体包含在应用内，你的用户将会得到更好的服务。

### 怎么做

刷新网页，查看Devtools的Network。

第一步，评估正在下载的所有资源，首先侧重于较大的文件。其中是否有任何图像，字体或媒体文件。

第二步，使用Network Throttling，查看你的应用程序是否有等待任何不必要的资源。

从互联网上加载你想要高频变化的内容是一个强有力的策略，为了进一步控制如何加载资源，请考虑使用Service Worker。

## 打包你的代码

调用require是一项繁重的操作。

### 为什么

现代JS开发通常设计许多文件和模块，将你的代码打包到单个文件可以减少require的次数。

### 怎么做

推荐使用webpack，parcel和rollup.js。


# 参考文档

https://www.electronjs.org/zh/docs/latest/tutorial/performance
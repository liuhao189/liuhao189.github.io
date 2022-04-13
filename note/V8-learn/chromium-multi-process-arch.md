# Chromium的多进程架构

## 问题

构建一个完全不崩溃的渲染引擎是不可能的。构建一个完全安全的渲染引擎也是不可能的。

在某些方面，Web浏览器类似于过去的单用户，多任务的操作系统。一个Bug或错误就可以带走整个浏览器。

现代操作系统更强大，因为它们将应用程序放入彼此隔离的单独进程中，而且每个进程对其它进程的数据访问受到限制。

## 架构概览

Chromium使用多进程架构，一个浏览器tab对应一个进程，还限制了每个渲染引擎对其它进程和系统其它部分的访问。

把运行UI并管理标签和插件的进程称为主进程或浏览器进程，把tab对应的进程称为渲染进程。渲染进程使用Blink来布局HTML。

## 管理渲染器进程

每个渲染器进程有一个全局的RenderProcess，这个对象管理和浏览器进程之间的通信、维护全局状态。浏览器进程维护了渲染器进程对应的RenderProcessHost，这个对象管理浏览器状态、和渲染器进程之间的通信。

浏览器进程和渲染器进程之间的通信使用Chromium的IPC系统。

## 管理视图

每个渲染器进程都一个或多个RenderView对象，对应于标签的内容。RenderProcessHost里维护了一个RenderViewHost对象。

在同一个渲染器进程中不同的视图有不同的ID，为了确定一个视图需要RenderProcessHost和ViewId。

和视图通信，需要通过RenderViewHost对象。

## 组件和接口

渲染器进程中：

1、RenderProcess对象处理从浏览器进程通过RenderProccessHost发送的IPC消息。一个渲染器进程中只有一个RenderProcess。

2、RenderView对象处理从浏览器进程通过RenderViewHost对象发送过来的消息，这个对象代表网页的内容。

浏览器进程中：

1、Browser对象表示浏览器窗口。

2、RenderProcessHost表示浏览器方面的和渲染器进程的IPC连接。

3、RenderViewHost对象封装了与远程RenderView的通信，RenderWidgetHost处理浏览器中RenderWidget的输入和绘制。

## 渲染器进程共享

一般，一个Tab或窗口会新建一个新进程，某些情况下，多个Tab或窗口共用一个渲染器进程是有必要的。

eg：如果应用想打开一个想同步通讯的新窗口(js使用window.open)，这种情况下，会共用渲染器进程。

如果渲染器进程过多，也有相应的策略来共用渲染器进程，或者已经有同域名下的页面。

## 检测崩溃或行为不当的渲染器

浏览器进程时刻关注了IPC连接的渲染器进程。如果渲染器进程没有了信号，渲染器进程就崩溃了，Tab会展示相应的消息来通知用户。

## 渲染器进程中的沙箱

由于渲染器运行在一个独立的进程中，我们有机会通过沙箱限制它对系统资源的访问。eg：只可以通过父进程来访问网络，限制对文件系统的访问。

## 内存回收

不可见的Tab拥有低优先级。Windows上最小化窗口会将其内存标记为可用内存。

在内存不足的情况下，Windows会将这些内存换到磁盘，然后更换出优先级更高的内存。

## 插件和扩展

Firefox类的NPAPI插件运行在独立的进程中。站点隔离项目旨在提供更多的渲染器直接的隔离，该项目的早期交付内容包括在隔离的进程中运行Chrome的HTML&JS扩展。


## 参考文档

https://www.chromium.org/developers/design-documents/multi-process-architecture/
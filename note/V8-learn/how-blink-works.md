# Blink如何工作

开发Blink是困难的，对于新开发者来说，Blink有许多Blink的自身概念和一些为实现非常快速的渲染引擎而引入的编码约定。

对于有经验的Blink开发者来说也不简单，因为Blink对性能，内存和安全的要求非常高。

本文主要讲述Blink如何工作的概述，希望有助于Blink开发人员快速熟悉代码结构。

## Blink负责什么

Blink是Web平台的渲染引擎。粗略地说，Blink实现了在浏览器选项卡中呈现内容的所有职责：

1、实现Web平台的规范，包括HTML，CSS和Web IDL。

2、嵌入V8并运行JS。

3、从底层网络堆栈请求资源。

4、构建DOM树。

5、计算样式和布局。

6、嵌入Chrome合成器并绘制图形。

Blink被很多软件通过Content-Public-API嵌入使用，比如Chromium，Android Webview和Opera。

## 进程-线程架构

### 进程

Chromium使用多进程架构。Blink运行在渲染器进程中。

从站点隔离的概念上来讲，每个渲染器进程最多对应于一个站点，但是实际上，当用户打开太多Tab或设备没有足够的RAM时，将每个渲染器进程限制为单个站点太重了。在这种情况下，渲染器进程可能被多个Tab或多个iframe共享。

渲染器进程在沙盒运行，Blink需要向浏览器进程发起系统调度请求，eg：文件访问、播放音频和访问用户配置文件数据(Cookie，密码)。

渲染器进程通过Mojo和浏览器进程进行通信，注意，过去使用Chromium IPC系统。

在Chromium方面，服务化正在进行，将浏览器进程抽象为一组服务。在Blink看来，Blink可以使用Mojo来和服务进程和浏览器进程通信。

### 线程

Blink有一个主线程，N个worker线程，还有一些内部的线程。

几乎所有重要的事都在主线程中。除了Workder以外的JS运行，DOM，CSS，样式和布局计算都在主线程。

Blink经过高度优化，以最大限度地提高主线程的性能。

Blink也可能创建多个worker线程来执行Web Workers，Service Workder和Worklets。

Blink和V8也会创建一系列内置进程来处理音频，数据库，垃圾回收器等。

对于跨线程通信，必须使用PostTask API进行消息传递。不鼓励使用共享内存变成，除非处于性能原因，这是为什么在Blink代码库中看不到很多互斥锁的原因。

### 初始化和析构Blink

Blink使用BlinkInitalizer::Initialize来初始化，需要在执行任何Blink代码之前调用该方法。

Blink不会析构，渲染器进程被强制退出，而不进行清理。一方面是为了性能原因，另一个原因是以优雅有序的方式清理渲染器进程中的资源非常困难。

## 目录结构

Content-Public-API是面向嵌入软件的API层，因为直接面向客户，需要小心维护。

Blink-Public-API是将third_party/blink的功能公开给Chromium的API层。

## WTF

WTF是Blink专用的lib，代码位于platform/wtf。我们正试图尽可能地统一Chromium和Blink之间的编码基础，因此WTF应该很小。

这个库是必需的，因为有许多类型，容器和宏确实需要针对Blink的工作负载和Oilpan(Blink-GC)进行优化。

如果该类型的WTF中定义了，Blink应该使用WTF的类型，而不是使用base目录下定义的类型和std类库。较流行的类型是vectors，hashsets，hashmaps和strings。

Blink应该使用WTF::Vector，WTF::HashSet，WTF::HashMap，WTF::String而不是std::vector，std::set等。

## 内存管理

就Blink而言，你需要关心三个内存分配器：

1、PartitionAlloc。

2、Oilpan(Blink GC)。

3、malloc/free，new/delete

可以使用USEING_FAST_MALLOC在PartitionAlloc的堆中分配新对象。创建的对象的生命周期应该由scoped_ref ptr或std:unique_ptr来管理。强烈不建议手动管理对象内存。

你可以使用GarbageCollected在Oilpan的堆中分配新对象。对象的生命周期由垃圾回收器管理。你可以使用特殊的指针来引用Oilpan堆里的对象。

如果你不使用USEING_FAST_MALLOC或GarbageCollected，对象会分配到系统malloc的堆。Blink强烈不建议这样做。

所有的Blink对象应该分配在PartitionAlloc或GarbageCollected中。默认使用Oilpan；在对象的生命周期非常清晰&使用std:unique_ptr或scoped_refptr足够，在Olipan中分配对象增加了复杂性，在Oilpan中分配对象增加了垃圾回收的运行压力时，才应该在PartitionAlloc中分配对象。

## 任务调度

为了提高渲染引擎的响应性，在Blink中的task应该尽可能异步执行。同步的IPC/Mojo或其它操作可能会耗费数毫秒的时间。

渲染引擎中的所有tasks应该添加到Blink Schedule中。Blink调度器维护了多个任务队列，可以智能得确定任务的优先级，以最大限度地提高用户感知的性能。

## 页面，框架，文档，DOMWindow

Page：页面对应于选项卡的概念，每个渲染器进程可能包含多个选项卡。

Frame：框架包括主框架或iframe，每一个Page可能包含一个或多个以树状层次结构排列的Frames。

DOMWindow：JS中的window对象，每一个Frame都有一个DOMWindow。

Document：JS中的window.document对象，每一个Frame都有一个Document。

ExecutionContext：是一个抽象的执行环境上下文的概念。eg：Workder线程有WorkerGlobalScope。

渲染器进程：Page = 1:N；Page：Frame=1：N；Frame:DOMWindow:Document=1:1:1。

## 进程外Iframes，Out-Of-Process Ifames（OOPIF）

Site Isolation使得浏览器更加安全，但是也更加复杂了。Site Isolation主要指的是每一个Site需要一个单独的渲染器进程。

如果一个页面包含一个跨站点的iframe，那么这个Page可能在两个渲染器进程中。

在渲染器进程中的frame由LocalFrame表示，不在当前渲染器进程中的Frame由RemoteFrame表示。

在两个渲染器进程之间通信主要通过浏览器进程。

### 分离的Frame和Document

Frame和Document可Detached，但是你仍然可以在Detached的frame上执行JS代码。

```js
doc = iframe.contentDocument;
iframe.remove();//detached iframe from the dom tree
doc.createElement('div'); // run script on the detached frame
```

由于frame已被detached，大多数DOM操作可能会失败并报错。规范中没有明确定义在detached的frame上执行操作该如何反应。

基本上，人们期望JS能够运行，但大多数DOM操作都会失败，出现一些异常。


## Web IDL(Interface Definition Language)绑定

当JS调用node.firstChild时，Blink是如何响应的？

首先，需要在IDL文件中定义：

```cpp
//node idl
interface Node: EventTarget {
    [...] readonly attribute Node ? firstChild;
}
```

然后，你需要定义C++类来实现Node，并定义C++的getter：

```c
class EventTarget : public ScriptWrappable {  // All classes exposed to JavaScript must inherit from ScriptWrappable.
  ...;
};
class Node : public EventTarget {
  DEFINE_WRAPPERTYPEINFO();  // All classes that have IDL files must have this macro.
  Node* firstChild() const { return first_child_; }
};
```

最后，你可以构建node idl，IDL编译器自动生成Node.firstChild的Blink-V8的绑定。

当JS调用node.firstChild时，V8调用V8Node::firstChildAttributeGetterCallback，然后调用你定义的Node::firstChild。

## V8和Blink

### Isoate，Context，World

Isolate，对应于一个物理线程，Isolate:thread=1:1，主线程有它自己的Isolate，Worker线程有它自己的Isolate。

Context对应于全局对象，因为每个frame都有它自己的window对象，所以一个渲染器进程中有多个Context。当你调用V8 API时，需要确保在正确的Context，否则会导致内存泄露或安全问题。

World，是一个支持Chrome扩展内容脚本的概念。内容脚本需要和网页共享DOM，但是为了安全原因，内容脚本的JS对象和网页的JS对象是隔离的。为了实现这种隔离，主线程创建了网页的隔离世界和内容脚本的隔离世界。网页的World和内容脚本的World可共享C++ DOM对象，但是JS对象是隔离的。共享C++ DOM对象是通过创建多个V8包装器对象来实现。


## V8包装器对象

每一个C++ DOM对象都有它对应的V8包装器对象。准确得说，每一个C++ DOM对象在每一个World都有对应的V8包装器对象。

V8包装器对象强引用它们对应的C++ DOM对象。C++ DOM对象只有弱引用V8包装器对象。

## 渲染流水线

从HTML文件传到Blink，到屏幕上的像素点。大概经历的流水线如下：

Main Thread：parse -> DOM -> style -> layout -> paint

然后到Compositor thread：commit -> tiling -> rester -> draw 

然后到GPU进程。


## 参考文档

https://docs.google.com/document/d/1aitSOucL0VHZa9Z2vbRJSyAIsAz24kX8LFByQ5xQnUg/edit
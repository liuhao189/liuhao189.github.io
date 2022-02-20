# V8 bindings的设计(Isolte,Context,World,frames,DOM Wrappers)

主要介绍V8绑定体系结构中的关键概念，但不包含DOM包装器的生存期管理。

## isolate

Isolate是V8的一个实例的概念。在Blink中，isolates和threads是1:1的关系。一个Isolate和主线程关联，一个Isolate和worker线程关联。

## Context

Context在V8中是一个全局变量作用域的概念。粗略得说，一个窗口对应一个上下文。每一个Context有它自己的全局变量和原型链。

例子：iframe有自己独立的window对象。

## Entered context and current context

Isolate和Context的关系很有趣。一个Isolate必须在多个frames里运行JS，每一个frame有自己的context。

这意味着某个isolate里的context的数量是随时间变化的，比例是1:N的关系。

两种类型的运行时堆栈：

1、JS函数的堆栈，是由V8管理的。当一个函数调用另一个函数时，被调用的函数被压入堆栈。当该函数返回时，该函数将从堆栈中pop。每一个函数都有一个关联的上下文，我们将当前运行函数的上下文称为当前上下文。

2、第二种堆栈，操作颗粒度要粗很多。这个堆栈是由V8 binding管理的，不是由V8管理的。当V8 binding调用JS时，V8 binding进入上下文并将上下文push到stack。当JS执行结束后，stack会pop Context，然后将控制权交给V8 binding。

entered上下文是当前JS执行开始的Context，当前上下文是当前运行的JS函数的Context。还有一种特殊的上下文，称为调试器上下文。如果调试器处于活动状态，debugger context会被插入到context堆栈。

## World

World是为了在不同的Chrome插件的内容脚本沙盒DOM Wrappers而设计的一个概念。有三种world：一个main world，一个isolated world，一个worker world。

main world是正常的JS脚本执行的空间。

isolate world是chrome插件的内容脚本执行的空间。1 main world : N isolated worlds。

worker world有一个worker thread，但是没有isolate world。



## 参考文档

https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/bindings/core/v8/V8BindingDesign.md
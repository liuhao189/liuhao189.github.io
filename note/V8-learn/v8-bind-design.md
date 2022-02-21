# V8 bindings的设计(Isolte,Context,World,frames,DOM Wrappers)

主要介绍V8 bindings体系结构中的关键概念，但不包含DOM包装器的生命周期管理部分。

## isolate

Isolate是V8的一个实例的概念。在Blink中，isolates和threads是1:1的关系。一个Isolate和主线程关联，一个Isolate和worker线程关联。

## Context

Context在V8中是一个全局变量作用域的概念。粗略得说，一个窗口对应一个上下文。每一个Context有它自己的全局变量和原型链。

例子：iframe有自己独立的window对象。

## Entered context and current context

Isolate和Context的关系很有趣。一个Isolate可能在多个frames里运行JS，每一个frame有自己的context。

这意味着某个isolate里的context的数量是随时间变化的，是1:N的关系。

两种类型的运行时堆栈：

1、JS函数的堆栈，是由V8管理的。当一个函数调用另一个函数时，被调用的函数被压入堆栈。当该函数返回时，该函数将从堆栈中pop。每一个函数都有一个关联的上下文，我们将当前运行函数的上下文称为当前上下文。

2、第二种堆栈，操作颗粒度要粗很多。这个堆栈是由V8 binding管理的，不是由V8管理的。当V8 binding调用JS时，V8 binding进入上下文并将上下文push到stack。当JS执行结束后，stack会pop Context，然后将控制权交给V8 binding。

entered Context是当前JS执行开始的Context，current Context是当前运行的JS函数的Context。还有一种特殊的上下文，称为调试器上下文。如果调试器处于活动状态，debugger context会被插入到context堆栈。

## World

World是为了在不同的Chrome插件的Content Scripts来沙盒化DOM Wrappers而设计的一个概念。有三种world：一个main world，一个isolated world，一个worker world。

main world是正常的JS脚本执行的空间。

isolate world是chrome插件的Content Script执行的空间。1 main world : N isolated worlds。

worker world有一个worker thread，但是没有isolate world。

在同一个Isolate中的所有worlds都共享底层的C++ DOM对象，但是每个world都有自己的DOM Wrapper。所以所有Worlds可以操作相同的C++ DOM。

每一个World有自己的Context，这意味这每一个世界有自己的全局变量和原型链。

由于沙盒机制，在一个Isolate的每一个world都不共享任何JS对象。


## isolates,contexts,worlds and frames的关系

1、DOM方面的需求，一个HTML页面可能有N个frames，每一个frame有它自己的Context。

2、JS方面的需求，一个Isolate有M个worlds，每一个world有它自己的Context。

因此，当我们执行有N个frames和M个worlds的页面时候，就会存在N*M个contexts。

主线程在同一时刻只能有一个当前的context，但是在主线程在生命周期中可以有N*M个Contexts。

另一方面，worker线程有0个frames和1个world，因此worker线程只有一个context，worker线程的context从不改变。

## DOM Wrappers and Worlds

为了兼容性原因，我们需要确保只要底层的C++ DOM对象还活着时，就返回相同的DOM Wrapper给JS。

```js
var div = document.createElement("div");
div.foo = 1234;  // expando
var p = document.createElement("p");
p.appendChild(div);
div = null;
gc();
console.log(p.firstChild.foo);  // This should be 1234, not undefined
```

为了实现上面的需求，我们需要一个C++ DOM对象到DOM Wrappers的映射表。此外，还需要每个World有沙盒化的DOM Wrappers。

为了满足需求，我们让每个世界都保存一个DOM包装器存储，这个存储存储了这个World的C++ DOM和DOM wrappers的映射关系。

结果，在一个Isolate中，我们有多个DOM Wrapper存储。

## DOM wrappers 和 Context

当你创建DOM wrappers，你需要选择正确的Context。如果选择了错误的Context，很可能导致JS对象泄露等安全问题。

```html
// main.html
<html><body>
<iframe src="iframe.html"></iframe>
<script>
var iframe = document.querySelector("iframe");
iframe;  // The wrapper of the iframe should be created in the context of the main frame.
iframe.contentDocument;  // The wrapper of the document should be created in the context of the iframe.
iframe.contentDocument.addEventListener("click",
    function (event) {  // The wrapper of the event should be created in the context of the iframe.
        event.target;
    });
</script>
</body></html>

// iframe.html
<script>
</script>
```


## 参考文档

https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/bindings/core/v8/V8BindingDesign.md
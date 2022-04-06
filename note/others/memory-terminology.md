# 内存术语

## Object sizes

将内存想象为基本类型的一个图结构。

一个对象可以以两种方式保留内存：

1、数据直接在对象内。

2、持有其它对象的引用，使得其它对象不能被垃圾回收。

在DevTools中，你可以看到shallow size和retained size。

### shallow-size

shallow-size是JS对象自己持有的数据大小。JS对象存储对象的描述信息，直接的值。

一般情况下，只有array和字符串有显著的shallow size。然而，字符串和外部数组的主存储通常在渲染器内存中，只在JS对上公开一个小的包装器对象。

渲染器内存表示整个进程的内存，包括native内存，页面的JS堆内存，workers的JS堆内存。

### retained-size

这个删除对象本身及其从GC根无法访问的从属对象后释放的内存大小。

GC根由handles构成，这些handlers是从本机代码引用V8之外的JS对象时创建的。

这些handler可以在堆快照中找到，GC roots -> handle-scope或GC roots -> global handlers.

在本文档中描述handlers而不深入浏览器实现细节可能会令人困惑。

在应用程序视角，有一些类型的roots:

1、window全局对象，在heap-snapshot中有一个distance列，这个列的值是window全局对象到该值得最短路径长度。

2、DOM-Tree，由遍历文档可以访问的所有DOM节点组成。注意，并非所有的Node节点都有JS包装器。

3、有时，调试器上下文和DevTools控制台可能会保留对象。使用干净的console，没有调试断点的环境来创建快照。

内存图从根开始，在浏览器中可能是window对象，node.js中可能是global对象。任何无法从根访问的对象都会被GC回收。

## Object-retaining-tree

堆是由相互连接的对象组成的网络，在数学中，这种结构被称为图。图是由节点和边构成的。

节点：使用用于构建它们的构造函数的名称进行标记。

边：使用属性的名称进行标记。

## 支配者

支配者对象由树结构组成，因为每个对象只有一个支配者。一个对象的支配者可能缺乏对它所支配的对象的直接引用。

## V8细节

分析内存时，了解堆快照为何以某种方式显示是很有帮助的。下面介绍一些关于V8-JS虚拟机内存相关的问题。

## JS-Object表示

有三种基础类型：Numbers，Booleans，Strings。这些节点不能引用其它类型，总是叶子节点。

Numbers可以存储为：1、31位的整数(Small integers)；2、堆对象，存储不能存储为(Small Integers)的值，比如double，或者需要装箱。

Strings可以存储为：1、虚拟机堆；2、渲染器内存中，一个简单的包装对象会在JS中创建。比如：script的源和内容，不会存储到VM堆中。

新JS对象的内存是从专用的JS堆中分配的，这些对象由V8的垃圾回收器管理。因此，只要至少有一个对它们的强引用，它们就会保持活动状态。

Native-Objects是在JS堆以外的对象。Native-Objects不被V8的垃圾器管理，只能通过JS的包装器对象来引用。

Array，在V8中被广泛用于存储大量数据。

Map，描述对象类型及其布局的对象。

## Object-Groups

每一个Native-Object都由相互引用，相互管理的对象组成。eg：DOM的子树都有它的parent，child，sibling的节点。

每个包装器对象都包含了对响应Native-Object的引用，用于将command重定向到该Native-Object。

Object-Groups保存着包装对象的引用。然而，这不会导致循环引用导致内存无法释放，GC可以处理这种情况。

但是忘记释放一个包装器对象，将保留整个Object-groups和对应的包装器。
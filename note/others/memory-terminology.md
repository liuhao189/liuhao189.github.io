# Chrome浏览器中的内存术语

## Object sizes

将内存想象为基本类型的一个图的数据结构。

一个对象可以以两种方式保留数据在内存中：

1、数据直接在对象内，直接设置基本类型的值。

2、持有其它对象的引用，使得其它对象不能被垃圾回收。

在DevTools中，你可以看到shallow size和retained size。

### shallow-size

shallow-size是JS对象自己持有的数据大小。典型的JS对象会保留一些内存以供其说明和存储直接值。

一般情况下，只有array和字符串有明显的shallow size。然而，字符串和外部数组的主存储通常在渲染器内存中，只在JS对上公开一个小的包装器对象。

渲染器内存表示整个进程的内存，包括native内存，页面的JS堆内存，workers的JS堆内存。

### retained-size

保留大小是对象删除后释放的内存大小。

GC根由handles构成，这些handlers是从本机代码引用V8之外的JS对象时创建的。

这些handler可以在堆快照中找到，GC roots -> handle-scope或GC roots -> global handlers.

看到某些类型的handlers，且不深入浏览器实现细节可能会令人困惑。

在应用程序视角，有以下类型的roots:

1、window全局对象，在heap-snapshot中有一个distance列，这个列的值是window全局对象到该值的最短路径长度。

2、DOM-Tree，由遍历文档可以访问的所有DOM节点组成。注意，并非所有的Node节点都有JS包装器，如果有JS包装器，则节点在文档中处于活动状态。

3、有时，调试器上下文和DevTools控制台可能会保留对象。使用干净的console，没有调试断点的环境来创建快照。

内存图从根开始，在浏览器中可能是window对象，node.js中可能是global对象。任何无法从根访问的对象都会被GC回收。

提示：清楚控制台，请运行clear()方法。

## Object-retaining-tree

堆是由相互连接的对象组成的网络，在数学中，这种结构被称为图。图是由节点和边构成的。

节点：使用用于构建它们的构造函数的名称进行标记。

边：使用属性的名称进行标记。

## 支配者

支配者对象由树结构组成，因为每个对象只有一个支配者。一个对象的支配者可能缺乏对它所支配的对象的直接引用。

## V8的特定内容

分析内存时，了解堆快照为何以某种方式显示是很有帮助的。下面介绍一些关于V8-JS虚拟机内存相关的知识。

## JS-Object表示

有三种基础类型：Numbers，Booleans，Strings。这些节点不能引用其它类型，总是叶子节点。

Numbers可以存储为：1、31位的整数(Small integers)；2、堆对象，存储不能存储为(Small Integers)的值，比如double，或者需要装箱。

Strings可以存储为：1、虚拟机堆；2、渲染器内存中，一个简单的包装对象会在JS中创建。比如：script的源和内容，不会存储到VM堆中。

新JS对象的内存是从专用的JS堆中分配的，这些对象由V8的垃圾回收器管理。因此，只要有一个对它们的强引用，它们就会保持活动状态。

Native-Objects是在JS堆以外的对象。Native-Objects不被V8的垃圾器管理，只能通过JS的包装器对象来引用。

Array，包含数字键的对象，在V8中被广泛用于存储大量数据。

Map，描述对象类型及其布局的对象。例如：映射用于描述隐式对象层次结构，用于快速访问属性。

## Object-Groups

每一个Native-Object都由相互引用，相互管理的对象组成。eg：DOM的子树都有它的parent，child，sibling的节点。

每个包装器对象都包含了对相应的Native-Object的引用，用于将command重定向到该Native-Object。

Object-Groups保存着包装对象的引用。然而，这不会导致循环引用导致内存无法释放，GC可以处理这种情况。

但是忘记释放一个包装器对象，将保留整个Object-groups和对应的包装器。
# Chromium内存使用背景知识

## 多进程模型

当Chromium启动时，初始会有一个浏览器进程和一个渲染器进程，当你新开一个浏览器Tab页时，你可能会得到一个新的渲染器进程。

插件，apps或扩展也可能在独立的进程中运行。所有的Chromium进程，在Windows的进程管理器中都叫chrome.exe。

从Windows XP以后的系统，进程管理器中的内存占用会低很多。因为后续的系统更新了内存占用衡量指标。

这两个操作系统主要测量一个进程的工作集，然而，工作集由三个不同的组成部分组成：

1、Private Working Set，仅此进程私有。

2、Shareable Woring Set，可共享的工作集。

3、Shared Working Set，当前进程正在与其它进程共享的工作集，这是可共享工作集的一个子集。

在Windows XP中，每个进程都使用总的Working Set表示内存占用。

在Windows Vista及以后变为了Private Working Set表示内存占用，这更加合理了。

## 怎样衡量内存

对于Chromium来说，我们想要找到一种可以衡量应用使用多少资源的指标。我们不能使用Total WorkingSet，因为这样会多次计算共享内存。

几乎所有的Windows应用都有共享内存。例如：每一个进程都需要加载若干个Windows DLLS(kernel32,ntdll,user32)，这些DLL都被Windows在全部进程中共，多次计算这些共享DLL将会增加内存。

最终，定的指标跟Windows使用的类似。我们测量Working-Set。私有的算法为：Private Working Set + Shareable Working Set - Shared Working Set。

## 怎样衡量内存-2

查看应用的Working Set并不是唯一的测量内存的方式。任何程序都会分配系统资源，消耗的常见资源是GDI内存，这个内存显示在系统的提交记录中，可能不会反映到工作集中。

要测量这一点，我们需要查看系统的总提交记录。总提交记录是所有应用程序和系统本身使用的内存总量。因为是系统维度的度量，最好关机重启进行测量。

## 多进程模型的弱点

使用多进程架构和构建轻量级浏览器矛盾，首先，每个进程都有一定的开销，但是可以使用了共享内存技术，进程开销就会相对小很多。Chromium进程最重要的开销是复制的浏览器内部组件，如缓存、JS虚拟机堆，内部数据结构，这些必须在多个进程中复制。

Chromium如何克服这些缺点？简而言之，这是不可能的。我们所能做的就是把其它所有东西都做得更小，这样多进程的影响就最小化了。

可以使用--single-process命令行来启动单进程模式。

## 多进程模型在内存方面的优点

第一个好处是：多进程浏览器更容易回收未使用的内存。当你关闭Tab时，进程的所有的资源会被返还给系统。

第二个好处是：当内存紧张时，Chromium可以积极帮助操作系统。当Windows系统内存紧张时，操作系统会从最小化的应用程序中获取内存页，Chromium对活动标签页也采用了完全相同的模式。单进程浏览器无法区分哪些选项卡正在使用哪些内存。

最后：多进程浏览器能够有选择地清理未使用的内存。如果你的系统内存不够用，可以使用Chromium的任务管理器来结束使用内存过多的Tab进程。

可以使用几种方式来帮助Windows系统管理内存。例如：如果你最小化了windows应用，Windows会自动释放应用的Working-Set给操作系统。Chromium使用了类似的方式来处理Tab。当Tab进入后台后，Chromium会降低后台Tab的优先级并释放Tab的一些Working-Set。

当其它应用程序需要内存时，Chromium会让出自己的内存，以便前台应用程序可以响应。同时，如果你让Chromium闲置一段时间，它会尝试把内存还给操作系统。

## 减少内存使用的部分TODO

字体管理：字体在内存中缓存的方式非常少。

字符串：重复的字符串是不好的。Blink/Chromium中的所有字符串都是unicode字符串。使用单字符可以减少体积。

历史子系统：SQLLite DB需要优化。

在内存中的缓存：Chrome目前使用一个共享缓存跨所有进程。当前最大大小为32MB。

JS：Chrome渲染器都有自己的JS虚拟机，减少JS的内存使用会带来好处。

工具：总是需要更好的工具。memory_watcher项目目前用于调试。

## 参考文档

https://www.chromium.org/developers/memory-usage-backgrounder/
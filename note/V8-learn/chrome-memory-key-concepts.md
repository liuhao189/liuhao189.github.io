# Chrome内存的关键概念

## 内存有什么难的？不就是malloc和free吗？

并不是，有许多差异和细微之处，因操作系统甚至操作系统配置而异。幸运的是，当程序以足够的资源运行时，这些差异大多会消失。当存在内存压力时，这些区别最终非常重要。

## 具体的例子来说明它是如何比malloc/free更难？

1、当Chrome申请内存时，何时会占用swap空间？

2、当内存free了，何时可被其它程序使用？

3、malloc后的内存都是安全的吗？

4、Chrome有多少堆？

5、GPU和驱动程序如何使用内存资源？

6、在GPU内存不与主内存共享的系统上，情况是否相同？

7、如何核算共享库？对于共享内存的每个进程，损失有多大？

8、Task Manager、Activity Monitor，top报告的是哪些类型的内存？

9、UMA的统计数据？

上述的许多答案，答案实际上会因操作系统而异。基于windows和unix的系统之间至少存在重大的区别。即使在Macos，Android，Cros或标准桌面Linux中，每个也有足够的分歧。

本文档的目的是提供一组通用的词汇和概念，以便Chromium开发人员可以更多地讨论上述问题，而不会相互误解。

## 关键问题

### windows分配后立即使用内存，其它操作系统在第一次接触后使用

windows和其它操作系统最大的区别是授予进程的内存总是在分配时提交。这意味着在Windows中，malloc(10*1024*1024*1024)将立即阻止其它应用程序成功分配内存。在类Unix系统中，当内存页被触及时才消耗系统资源。如果不了解这种差异，可能会导致对windwos和其它系统使用资源的误解。

### 由于分配内存的差异，丢弃内存在操作系统间意义完全不同

Unix系统中，有一个madvise函数，通过该函数，可以返回到非资源消耗状态。但是，Windows上却没有这样的API。VirtualAlloc(MEM_RESET)，DiscardVirtualMemory，OfferVirtualMemory初看起来很相似，因为它们会立即减少进程使用的物理RAM的数量，但是，它们不会释放swap，无助于防止OOM方案。

## 术语和定义

1、Virtual memory，内核公开的进程抽象层，一个连续的区域，分为4kb的虚拟页面。

2、Physical memory，内核内部的每个计算机的抽象层，一个连续的区域，分为4kb的物理页面。每个物理页代表4kb的物理内存。

3、Resident，由物理页面支持的虚拟页面。

4、Swapped/Compressed，由物理页面以外的其它内容支持的虚拟页面。

5、Swapping/Compression，动词，获取常驻页面并使其交换/压缩页面的过程。这样可以释放物理内存。

6、Unlocked Discardable/Reusable，Android和Darwin特有，一个虚拟页面，其内容由物理页面支持，但内核可以在任何时间点自由重用物理页面。

7、Private，一个只可以由当前进程修改其内容的虚拟页面。

8、Copy或Write，父进程拥有的私有虚拟页面。当父进程或子进程尝试进行修改时，会向子进程提供页面的私有副本。

9、Shared，一个虚拟页面，其内容可以和其它进程共享。

10、File-backed，一个虚拟页面，其内容反映文件的内容。

11、Anonymous，未支持File-backed的虚拟页。

## 共享内存

在Linux上，一种常见的解决方案是使用成比例的大小。它计算驻留大小为1/N，N为其它进程的数量。缺点是依赖上下文，开更多的进程可能会导致单个进程占用更少。


## 参考文档

https://chromium.googlesource.com/chromium/src.git/+/master/docs/memory/key_concepts.md
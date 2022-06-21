# electron-memory相关

## 内存概念分享

### 虚拟地址空间（Virtual Address Space）

进程的虚拟地址空间是它可以使用的虚拟内存地址集。每个进程的地址空间是私有的，除非其它进程共享，否则其它进程无法访问该地址空间。

### 虚拟内存 （Virtual Memory）

为了最大程度地提高管理内存的灵活性，系统可以将物理内存页移入磁盘上的分页文件，或从磁盘上的分页文件移入物理内存。磁盘上的分页文件称为虚拟内存。

### 工作集（Working Set）

驻留在物理内存中的进程的虚拟地址空间子集称为工作集。工作集不能反映实际物理内存占用情况，因为它会计算进程共享内存。

### 私有内存 Private Bytes

私有内存表示已申请的(不一定被使用)内存页文件总量。不包括进程共享内存的部分。

### 私有工作集 (Working Set Private)

工作集的子集，只包含进程私有的工作集，它不会重复计算进程共享内存。共享内存的只会加到创建共享内存的进程中。Windows的任务管理器的内存列使用私有工作集。

## Mac活动监视器相关

![mac-activity-monitor](/note/assets/imgs/electron-memory/mac-memory.png)

### memory标签页下方

物理内存（Physical Memory）：就是物理内存。

已使用内存（Memory Used）：所有进程使用的内存。这里面包括：

1、App内存（App Memory），apps使用的内存。

2、联动内存（Wired Memory），这些通常是机器的主要进程，它们需要快速访问，不能与磁盘上的内存交换。

3、被压缩内存（Compressed），macOS会在系统内存压力大时，压缩一部分不活跃的内存。当压缩区域的内存被请求时，macOS会立即解压缩。

已使用的交换（Swap Used），虚拟内存的使用量。

已缓存的文件（Cached Files）,MacOS将最近关闭的应用使用的内存作为缓存，已使用户可以快速启动相同的应用。这部分内存也可以被其它应用使用。purge命令可清理文件缓存。

实际内存（Real Memory）,Unix通常所说的RSS或常驻内存集Resident Set Size，这是进程当前占用的页的数量，包括虚拟页。

内存（Memory）,在物理内存中使用的内存量。




## 参考文档

https://docs.microsoft.com/zh-cn/windows/win32/memory/virtual-address-space


https://apple.stackexchange.com/questions/107578/memory-terminology-in-mavericks-activity-monitory/112502#112502

https://forums.macrumors.com/threads/memory-vs-real-memory.1749505


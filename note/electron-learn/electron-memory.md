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

## electron内存相关API

### app.getAppMetrics

返回ProcessMetric[]。ProcessMetric结构中有memory信息。

```json
//Mac端
{
    "cpu": {
        "percentCPUUsage": 0.2858202539941989, 
        "idleWakeupsPerSecond": 4
    }, 
    "pid": 580, 
    "type": "Browser", 
    "creationTime": 1655908106692.505, 
    "memory": {
        "workingSetSize": 186736, // Mac的和活动监视器一致
        "peakWorkingSetSize": 187552,  // Mac的和活动监视器一致
        "privateBytes": 103424, // windows only
    }, 
    "sandboxed": false
},
// windows端
{
	"cpu": {
		"percentCPUUsage": 0,
		"idleWakeupsPerSecond": 0
	},
	"creationTime":  1655908106692.505,
	"integrityLevel": "medium",
	"memory": {
		"workingSetSize": 275352, // 任务管理器，270648，差距不大
		"peakWorkingSetSize": 353264, 
		"privateBytes": 175640, // 171.5M，任务管理器为171.7M，此次差异不大，但某些情况下差异会很大，该值应该等于任务管理器内存 + 虚拟内存的值。
	},
	"pid": 9852,
	"sandboxed": false,
	"type": "Tab"
}
```

### process.getBlinkMemoryInfo

主要是返回blink的内存信息，对于调试DOM相关内存问题有帮助。

```json
{
  allocated: 24543, //已分配的对象大小
  total: 30398, // 分配的总空间
}
```

### process.getProcessMemoryInfo


```json
// mac端
{
  
  private: 111128, //(108M) 私有内存 Mac监视器：118M；
  shared: 4252,//(3.54M) 共享内存 Mac活动监视器：191.9M 主要是因为统计口径不同，mac活动监视器包含了其它进程共享的。
}
// windows端
{ 
  residentSet: 281192, 
  private: 193324, //188.8M 任务管理器为166.1M，该值明显大于任务管理器
  shared: 24580, // 24M，任务管理器为89.88M，同mac的，统计口径不一致
}
```


### process.getSystemMemoryInfo

返回系统的内存信息。

```json
//Mac端
{
    free: 2554776, // 2.44G，Mac的不正确，此时有8.42G可用内存，主要是加上已缓存文件的大小。
    total: 16777216,// 16G，Mac的正确
}
// windows端
{ 
   total: 7812864, // 7.45G，准确
   free: 4717092, // 4.5G，准确
   swapTotal: 9058048,  //8.64G
   swapFree: 5895496, // 5.6G
}
```




## 参考文档

https://docs.microsoft.com/zh-cn/windows/win32/memory/virtual-address-space


https://apple.stackexchange.com/questions/107578/memory-terminology-in-mavericks-activity-monitory/112502#112502

https://forums.macrumors.com/threads/memory-vs-real-memory.1749505


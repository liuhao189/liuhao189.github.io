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

## electron应用内存占用

简单应用的对比：Hello World App的占用情况。

![other-cross-platform](/note/assets/imgs/electron-memory/other-platform-vs.png)

复杂应用的内存占用：Microsoft teams应用（活跃用户2.5亿）

![teams-user-feedback](/note/assets/imgs/electron-memory/teams-feedback.png)

![teams-user-feedback-2](/note/assets/imgs/electron-memory/teams-feedback-2.png)

要考虑到Microsoft teams是一个工作类工具软件，需要实时在线。如果用户需要打开其它大型专业类软件(CAD，PS，3DMax等)，office，开一些网页。对于一些低内存设备，使用体验会很差。针对这些用户反馈，Microsoft专门解释了“为什么teams使用了这么多内存”，但似乎用户并不买账，后面宣布切换到webview2，内存占用初期少了一半。

感觉就像网游一样，如果你的产品想对外推广，扩大用户群体。就需要在市场上大多数设备上比较完美地运行。单机游戏或主机游戏可以提高游戏效果，有特色抓住特定群体即可。

## 为什么electron这么耗内存

主要原因是多进程架构。

1、每个进程都有一定的开销。

2、浏览器进程需要复制的内部组件开销，主要是不能共享的内部数据结构和组件。比如：Blink的实例和V8的实例。

3、Chromium的GPU硬件加速渲染也很耗内存，主要是因为渲染管线比较长，且有缓存。感兴趣可以看(https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)。

chrome也很耗内存（相比electron多包含插件，google账户体系，书签，浏览记录等功能），但是chrome浏览器在系统内存不足时做了很多优化。比如，同域名网站共用进程，甚至不同域共用进程，不活动的tab保存到硬盘，削减后台页面运行频率，GPU进程的内存优化等等。

基于Chromium的electron应用，相比chromium浏览器，electron应用多了node集成和electron-js端的代码。

## 灵犀桌面端遇到的内存问题

### 内存泄漏

一些客户反馈灵犀客户端占用内存大。

![memory-so-big](/note/assets/imgs/electron-memory/memory-so-big.png)

说到内存泄漏，离不来V8的垃圾回收机制。时间有限，简单说下。

1、V8有一个代际的，stop-the-world的垃圾回收器。

2、垃圾回收期的工作是遍历内存中分配的对象并确定它们是死的还是活的，死去的对象会被删除。

3、对象是否Alive的基本检查是执行代码的程序是否可以访问它，最容易到达的对象可能是在根作用域中定义的对象。eg：window对象上添加的属性。

详细信息可以查看：https://v8.dev/blog/free-garbage-collection。

两个大类：

1、DOM节点泄漏，这种的V8的内存可能比较少，但是GPU和Render进程内存消耗大。

2、JS代码泄漏，闭包中大的数据结构，未注销的事件监听器。主要发生在频繁销毁和重建的组件中。

三类原因：

1、自身代码的问题。我们使用的是React框架，大部分是React的组件销毁时未清空资源。

```js
useEffect(() => {
  const keydownAction = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      updateSelectState('');
    }
  };
  document.addEventListener('keydown', keydownAction);
}, []);
```

2、第三方代码库的内存泄漏问题。例如：overscrollbars，这个类库的主要问题是它需要监听容器内image元素的onLoad事件，来改变scrollbar的高度信息，但是它在内存中保存了所有遇到过的image元素，导致HTMLImageElement泄漏。

![overscrollbars-bugs](/note/assets/imgs/electron-memory/overscrollbar-bug.png)

3、Chromium的bug导致的内存泄漏，以特定方式使用会导致内存无法释放。例如：video元素里添加track会导致内存泄漏。

### 排查工具

主要是DevTools的memory tab。

![devtools-memory](/note/assets/imgs/electron-memory/devtools-memory.png)。

https://lingxi.office.163.com/doc/#id=19000001072664&from=PERSONAL&parentResourceId=19000001273924&spaceId=505038230&ref=516227086

## 参考文档

https://docs.microsoft.com/zh-cn/windows/win32/memory/virtual-address-space

https://apple.stackexchange.com/questions/107578/memory-terminology-in-mavericks-activity-monitory/112502#112502

https://forums.macrumors.com/threads/memory-vs-real-memory.1749505

https://docs.microsoft.com/en-us/microsoftteams/teams-memory-usage-perf




# Microsoft-Team如何使用内存

文章解释了Teams如何使用内存，为什么Teams桌面应用和Teams网页应用不会阻止同一台计算上的其它应用程序和工作负载拥有足够的内存来优化运行。

Teams使用了现代的网页开发技术Electron来开发桌面端应用。

使用Electron开发可以允许更快的开发，容易维护不同系统（web，windows，mac，linux）的应用。

## Teams的内存使用

### Teams预期的内存使用情况

不管你使用Teams桌面应用还是Teams Web应用，Chromium都会根据当前系统可用内存量来尽可能优化使用体验。

当其它应用或服务需要内存时，Chromium会将内存分配给这些进程。Chromium持续调整Teams的内存使用情况，以在不影响当前运行的其它应用的基础上，来优化Chromium的体验。

下图为不同的可用内存时，打开相同的软件，进行相同的操作的内存记录图。

![不同可用内存Teams内存使用量](/note/assets/imgs/how-teams-use-memory/diff-mem-available.png)

当计算机有更多内存时，Teams将使用这些内存，在内存不足的系统中，Teams将使用更少的内存。

### 系统内存问题的症状

如果你发现下面的问题，你可能有严重的系统内存问题：

1、同时运行多个大型应用。

2、系统性能下降或应用程序挂起。

3、持续的系统内存使用率超过90%。有了这个内存使用率，Teams应该会把内存还给其它应用程序。

## 参考文档

https://docs.microsoft.com/en-us/microsoftteams/teams-memory-usage-perf
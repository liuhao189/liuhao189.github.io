# Chromium内存使用背景知识

## 多进程模型

当Chromium启动时，初始会有浏览器进程和渲染器进程。当你新开一个浏览器Tab页时，你可能会得到一个新的渲染器进程。

插件，apps或扩展也可能在独立的进程中运行。所有的Chromium进程，在Windows的进程管理器中都叫chrome.exe。

从Windows XP以后的系统，进程管理器中的内存占用会低很多。因为以后的系统更新了内存占用衡量指标。

这两个操作系统主要测量一个进程的工作集，然而，工作集由三个不同的组成部分组成：

1、Private Working Set，仅此进程私有。

2、Shareable Woring Set，可共享的工作集。

3、Shared Working Set，当前进程正在与其它进程共享的工作集，这是可共享工作集的一个子集。

在Windows XP中，每个进程都使用总的Working Set表示内存占用。

在Windows Vista及以后变为了Private Working Set表示内存占用，这更加合理了。
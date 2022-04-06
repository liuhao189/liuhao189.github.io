# 使用Detacked-Elements工具来调试DOM内存泄漏

Edge的Detacted-Element工具主要用于发现浏览器无法垃圾回收的Detached的元素，同时定位到仍然引用这些元素的JS对象。

当一个Element不在DOM树中，但是仍然被你页面的JS代码所引用，一般会出现内存泄漏问题。

## 打开Detached-Elements工具

打开DevTools，然后打开Detached Elements tab查看即可。

## 获取detached-elements

点击左上角的Get Detached Elements按钮(刷新图标)即可。

Demo应用中，当你点击Room-2的时候，Room-1产生的DOM已经不在该DOM树上，但是仍然被JS所引用。

## 触发垃圾回收

然后，点击垃圾回收(垃圾箱图标)即可。当你点击垃圾回收按钮时，浏览器执行垃圾回收。

## 识别出引用Detached-elements的JS代码

当你发现不能被垃圾回收的detached-elements时，可以点击分析按钮(查看图标)来识别出引用detached-elements的JS对象。

分析按钮会生成堆快照，然后定位到该detached-element在堆中的位置。

Memory-tool的Retainers就展示出引用detached-element的对象。

## 识别出DOM节点导致的其它问题

因为DOM是一个全连接的图，一个DOM节点被JS保留时，这可能会导致其它DOM节点也被保留。

识别出引起泄漏的DOM节点很重要。点击Detach-Element(鼠标触摸板图标)按钮，可以销毁在detached-tree中的parent-child链接。然后点击垃圾回收(垃圾桶)按钮。

## 改变不同的origin

可以选择不同的origin或frame。

## 额外的考量

detached-elements并不一定意味着内存泄漏。某些情况下，detached的element可能会reattached到DOM树中。

# 修复内存问题

主要是如何使用Microsoft Edge和DevTools来查找内存问题。

## 内存膨胀-怎样样才算是太多

用户的设备和浏览器都不同，并不总是有一个特定的数字来指示是否是内存膨胀。主要是考虑主流设备能否拥有好的体验。

## 可以使用Edge的任务管理器来查看实时内存

memory的列展示的是native内存，DOM节点存储在Native内存中。如果这个增长，说明DOM节点正在被创建。

JS-memory列表示的JS的堆内存。这列包括两个部分，一部分是live的大小，live的大小表示页面正在使用的对象大小。如果这个数值在增长，说明新对象在创建，或已有对象在增长。

## 在Performance-panel可视化内存泄漏

如果看到JS heap size和node size在增长，可能存在内存泄漏。

## 使用Heap Snapshots发现detached-DOM节点内存泄漏

DOM节点回收，只在DOM树中没有引用和JS代码中没有引用时，才会执行。

detached的DOM节点说明从DOM树中移除，但是某些JS节点还在引用它。这是常见的内存泄漏原因。

```js
var detachedTree;
function create() {
    var ul = document.createElement('ul');
    for (var i = 0; i < 10; i++) {
        var li = document.createElement('li');
        ul.appendChild(li);
    }
    detachedTree = ul;
}
document.getElementById('create').addEventListener('click', create);
```

堆快照是一种查明detached节点的方式。获取到堆快照后，在Class过滤器的文本框中输入Detached，可以得到Detached的DOM节点。

在下面的Objects面板，你可以看到哪些代码引用了那个DOM节点。

## 通过申请内存记录来发现内存JS堆内存泄漏

时间线上蓝色的条表示内存申请，

## 函数维度分析内存分配

还是Memory-tab下的功能。

## 频繁GC导致的问题

Performance-tab下的频繁的内存变化，表明有频繁的GC操作。

## 参考文档

https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/memory-problems/dom-leaks

https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/memory-problems/
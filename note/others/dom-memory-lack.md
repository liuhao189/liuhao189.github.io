# 使用Detacked-Elements工具来调试DOM内存泄漏

Edge的Detacted-Element工具主要用于发现浏览器无法垃圾回收的Detached的元素，同时定位到仍然引用这些元素的JS对象。

当一个Element不在DOM树中，但是仍然被你页面的JS代码所引用，一般会出现内存泄漏问题。


## 参考文档

https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/memory-problems/dom-leaks
# Chrome中的GPU加速

## 为什么需要GPU加速

传统上，网页浏览器完全依赖CPU来呈现网页内容，随着GPU的普及，任命开始关注如何有效使用底层硬件来实现更好的性能和节能。使用GPU来合成网页的内容可以导致非显著的性能提升。

有三个优点：

1、在GPU上合成页面可以达到更好的效率。

2、GPU上已存在的内容，读取是不必要的。eg：video，Canvas2D或WebGL。

3、CPU和GPU并行，可以同时运行创建一个高效的图形管道。

## 参考文档

https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/
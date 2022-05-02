# Chrome中的GPU加速

## 为什么需要GPU加速

传统上，网页浏览器完全依赖CPU来呈现网页内容，随着GPU的普及，人们开始关注如何有效使用底层硬件来实现更好的性能和节能。使用GPU来合成网页的内容可以导致显著的性能提升。

有三个优点：

1、在GPU上合成页面可以达到更好的效率。

2、GPU上已存在的内容，CPU再次读取是不必要的。eg：video，Canvas2D或WebGL。

3、CPU和GPU并行，可以同时运行创建一个高效的图形管道。


## Blink渲染的基础


Blink渲染引擎的源代码庞大、复杂，而且几乎没有文档记录。为了了解GPU加速在Chrome中的工作原理，首先需要了解Blink如何呈现页面的基本构造块非常重要。

### DOM节点和DOM树

网页的内容在内部存储为称为DOM树的数据结构中。

### 从DOM节点到RenderObjects

生成可视输出的DOM节点都有一个相应的RenderObject。RenderObject存储在一个并行树结构中，称为渲染树。RenderObejct知道如何在显示表面上绘制节点的内容。它通过想GraphiceContext发出必要的绘制调用来实现此目的。GraphiceContext负责将像素写入位图，最终显示到屏幕上。在Chrome中，GraphiceContext包装了我们的2D绘图库Skia。

### 从RenderObject到RenderLayers

每个RenderObject都通过一个祖先RenderObject直接或间接地与RenderLayer相关联。共享相同坐标系统的RenderObejct通常都属于同一个RenderLayer。

RenderLayer可以以正确的顺序合成页面的元素，以正确显示重叠的内容，半透明元素等。有许多条件会触发为特定的RenderObject创建新的RenderLayer。

以下情况会产生新的RenderLayer：

1、页面的初始元素。

2、有清晰的CSS位置属性，eg：relative，absolute，transform。

3、透明的。

4、有overflow，透明遮罩层或倒影。

5、CSS filter。

6、Canvas：3D上下文或加速的2D上下文。

7、Video元素。

请注意：RenderObjects和RenderLayers之间没有1对1的对应关系，特定的RenderObject要么与为其创建的RenderLayer相关联，要么与具有渲染图层的第一个祖先的RenderLayer相关联。

RenderLayers也形成一个树的层次结构。

### 从RenderLayer到GraphiceLayers

为了是由合成器，一些RenderLayer会获得自己的背面图形。每个RenderLayer要么有自己的GraphiceLayer，要么是由其第一个祖先的GraphicsLayer。

每一个GraphiceLayer都有GraphiceContext供关联的渲染层绘制到其中。合成器最终负责在随后的合成过程中将GraphiceContexts的位图输出组合到最终的屏幕图像中。

理论上，每个RenderLayer都可以将自己绘制到单独的backSurface，但这在内存方面可能非常浪费。当前的Blink实现中，RenderLayer必须满足以下条件之一，才能获得自己的合成图层。

1、Layer有3D或透视转换的CSS属性。

2、Layer由硬件解码的Video元素使用。

3、Layer由3d上下文或2d加速的canvas元素使用。

4、Layer由合成器插件使用。

5、Layer使用CSS的opacity动画，或使用webkit的转换动画。

6、Layer使用加速的CSS filters。

7、Layer有一个合成层的后代。

8、Layer有一个low zIndex的兄弟节点。


## 层压缩

从来没有一个规则没有例外。GraphiceLayer在内存和其它资源方面可能很昂贵。eg：一些关键操作的CPU时间复杂度与GraphiceLayer树的大小成正比。可以为Renderlayer创建许多其它图层，这些图层与RenderLayer与其自己的back surface面重叠，这可能非常昂贵。

我们称内在合成（具有3D变化的图层）原因为直接合成原因。为了防止图层爆炸，当许多元素在一个直接合成的图层上时，Blink使用多个渲染层叠加一个直接合成的渲染层，并将它们压缩到一个单一的后台存储中。



## 参考文档

https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/
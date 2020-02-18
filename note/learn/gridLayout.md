# CSS网格布局

## 简介

CSS网格布局引入了二维布局系统，可用于页面主要的区域布局或小型组件布局。

## 什么是网格

网格是一组相交的水平线或垂直线，它定义了网格的列和行。我们可以将网格元素放置在这些行和列相关的位置上。

特点：

1、固定的位置和弹性的轨道大小，可以使用像素单位，可以使用百分比，也可以使用专门的新单位fr 来创建有弹性尺寸的网格。

2、元素位置。可以使用行号、行名或标定一个网格区域来精确定位元素。网格同时还是有一种算法来控制未给出明确网格位置的元素。

3、创建额外的轨道来包含元素。可以使用网格布局定义一个显式网格，但是根据规范它会处理你加在网格外面的内容。

4、对齐控制。网格包含对齐特点，以便我们可以控制放置到网格区域中的物体对齐，以及整个网格如何对齐。

5、控制重叠内容，元素可以放置在网格单元格中，或者区域可以部分地彼此重叠，使用 z-index 属性来控制重叠区域显示的优先级。

## 网格容器

通过声明display:grid 或 display:inline-grid 来创建一个网格容器，这个元素的所有直系子元素将成为网格元素。

浏览器给下列元素创建了一个单列网格。

```html
  <div class="wrapper">
    <div>One</div>
    <div>Two</div>
    <div>Three</div>
    <div>Four</div>
    <div>Five</div>
  </div>
  <style>
    .wrapper {
      display: grid;
    }
  </style>
  <script>
    //默认每个子元素占据一行。高度为内容高度，宽度为 100%。
  </script>
```

## 网格轨道

通过grid-template-colums 和 grid-template-rows属性来定义网格中的行和列，这些属性定义了网格的轨道，一个网格轨道就是网格中任意两条线之间的空间。

以下代码创建了三列 200 像素宽的列轨道。

```html
  <style>
    .wrapper {
      display: grid;
      grid-template-columns: 200px 200px 200px;
    }
  </style>
```

## fr单位

轨道可以使用任意长度单位进行定义，网格还引入了一个另外的长度单位来帮助我们创建灵活的网格轨道。
新的 fr 单位代表网格容器中可用空间的一等分。

这些轨道会随着可用空间增长和收缩。

有绝对单位，剩下的空间再平均分配。

```html
  <style>
    .wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-columns: 2fr 1fr 1fr;
      grid-template-columns: 500px 1fr 2fr;
    }
  </style>
```

## repeat函数

多轨道的大型网格可使用 repeat 函数来重复部分或整个轨道列表。

repeat(n,...args)，n 代表重复的份数，args 代表需要重复的配置。

```html
  <style>
    .wrapper {
      display: grid;
      grid-template-columns: 40px repeat(3, 1fr 2fr);
    }
  </style>
```

## 隐式和显式网格

显式网格包含了你在grid-template-columns 和 grid-template-rows 属性中定义的行和列。

如果在网格之外又放了一些东西，或者因为内容的数量而需要更多网格轨道的时候，网格将会在隐式网格中创建行和列。

可以使用 grid-auto-rows 和 grid-auto-columns 属性来定义一个设置大小尺寸的轨道。

```html
  <style>
    .wrapper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 100px;
    }
  </style>
```

## 轨道大小和 minmax

用 minmax 作为 grid-auto-rows 的值。创建行高最小为 xxpx，最大为 auto。用 auto 意味着行的尺寸将会根据内容的大小来自动变换。

```html
  <style>
    .wrapper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: minmax(100px, auto)
    }
  </style>
```

## 网格线

Gird 会为我们创建编号的网格线来让我们来定位每一个网格元素。网格线的编号顺序取决于文档的书写模式，从左到右书写语言中，编号为 1 的网格线位于最左边。

## 跨轨道放置网格元素

放置元素时，我们可以使用网格线定位，而非网格轨道。我们使用 grid-column-start，grid-column-end，grid-row-start和 grid-row-end 属性。

剩下元素会自动放到网格剩余的空间中。

```html
<div class="wrapper">
    <div class="box1">One</div>
    <div class="box2">Two</div>
    <div class="box3">Three</div>
    <div class="box4">Four</div>
    <div class="box5">Five</div>
  </div>
  <style>
    .wrapper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 100px;
    }

    .box1 {
      grid-column-start: 1;
      grid-column-end: 4;
      grid-row-start: 1;
      grid-row-end: 3;
    }

    .box2 {
      grid-column-start: 1;
      grid-row-start: 3;
      grid-row-end: 5;
    }
  </style><div class="wrapper">
    <div class="box1">One</div>
    <div class="box2">Two</div>
    <div class="box3">Three</div>
    <div class="box4">Four</div>
    <div class="box5">Five</div>
  </div>
  <style>
    .wrapper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 100px;
    }

    .box1 {
      grid-column-start: 1;
      grid-column-end: 4;
      grid-row-start: 1;
      grid-row-end: 3;
    }

    .box2 {
      grid-column-start: 1;
      grid-row-start: 3;
      grid-row-end: 5;
    }
  </style>
```

## 网格单元

一个网格单元是在一个网格元素中最小的单位，概念上来讲其实它和表格的一个单元格很像。

一旦一个网格元素被定义在一个父级元素当中，那么它的子级元素将会排列在每个定义好的网络单元中。

## 网格区域

网格元素可以向行或列的方向扩展一个或多个单元，并且会创建一个网格区域。

## 网格间距

在两个网格单元之间的网络横向间距和网格纵向间距可使用 column-gap 和 row-gap 属性来创建。

间距使用的空间会在使用弹性长度 fr 的轨道的空间计算前就被留出来。你不能像间距中插入任何内容，间距就想一条很宽的基线。

```html
  <div class="new">
    <div>One</div>
    <div>Two</div>
    <div>Three</div>
    <div>Four</div>
    <div>Five</div>
  </div>
  <style>
    .new {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: minmax(100px, auto);
      column-gap: 10px;
      row-gap: 1em;
    }

    .new>div {
      background-color: red;
      color: white;
    }
  </style>
```

## 嵌套网格

一个网格元素可以成为一个网格容器。

## 使用 z-index 控制层级

多个网格项目可以占用同一个网格单位。可以使用 z-index 让网格重叠。

## Grid and flexbox

CSS 网格布局和弹性盒布局的主要区别在于弹性盒布局是为一维布局服务的（沿横向或纵向的），而网格布局是为二维布局服务的（同时沿着横向和纵向）。

### 一维布局 vs 二维布局

设置 flex-wrap 属性，从而当容器变得太窄时，元素会换到新的一行。换到新的一行的元素分享了这行的可用空间，并没有与上一行元素对齐。

允许弹性元素换行时，每个新行都变成了一个新的弹性容器，空间分布只在行内进行。

```html
<!-- flex layout -->
 <div class="wrapper">
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
      <div>Four</div>
      <div>Five</div>
    </div>
    <style>
      .wrapper {
        display: flex;
        flex-wrap: wrap;
      }

      .wrapper>div {
        flex: 1 1 200px;
        background-color: orange;
      }
    </style>
```
grid的版本。

```html
<!-- grid layout -->
 <div class="wrapper">
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
      <div>Four</div>
      <div>Five</div>
    </div>
    <style>
      .wrapperg {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
      }

      .wrapperg>div {
        background-color: orange;
      }
    </style>
```

我只需要按行或按列控制布局，那就用弹性盒子。

我们需要同时按行和列控制布局，那就用网络布局。

### 从内容出发还是从布局入口

弹性盒从内容出发，一个使用弹性盒的理想情形是你有一组元素，希望它们能平均地分布在容器中。你让内容的大小决定每个元素占据多少空间。如果元素换行，会根据新行的可用空间决定它们自己的大小。

网格则从布局入口，先创建网格，然后再把元素放入网格中，或者让自动放置规则把元素按照网格排列。

弹性盒不能很好布局时，可以使用网格布局。

### 盒对齐

弹性盒特性最让人激动的一点是我们第一次拥有了正当的对齐能力。弹性盒已经被加入到新规范和 Box Alignment Level3。意味着它们能被用在包括网格布局的其它规范中。

```html
    <div class="wrapper">
      <div class="box1">One</div>
      <div class="box2">Two</div>
      <div>Three</div>
      <div>Four</div>
      <div>Five</div>
    </div>
    <style>
      .wrapper {
        display: flex;
        flex-wrap: wrap;
        min-height: 300px;
        align-items: flex-end;
      }

      .box1 {
        align-self: stretch;
      }

      .box2 {
        align-self: flex-start;
      }

      .wrapper>div {
        flex: 1 1 200px;
        background-color: orange;
      }
    </style>
```

### 网格中的布局

对于网格来说，我们是让元素在它们各自的网格区域中对齐，但它也可能是多个单元组成的一个区域。

因为不是 flex，所以不会有 flex 前缀。

```html
   <style>
      .grid-wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: end;
        grid-auto-rows: 200px;
      }

      .grid-wrapper>div {
        background-color: orangered;
      }

      .boxg1 {
        align-self: stretch;
      }

      .boxg2 {
        align-self: start;
      }
    </style>
```

### fr单位和 flex-basis属性

fr单位在网格容器中分配一定比例的可用空间到我们的网络轨道。当与 minmax 函数结合使用时，fr 单位可以给我们与 flexbox 中的 flex 属性非常相似的行为。

两种布局方式对响应式的处理存在不同，弹性布局，拖拽以改变浏览器大小时，弹性盒会根据可用空间适当地调整行中项目的个数。当有足够的空间时，全部的项目会在一行展示。

网格布局则始终保持 3 列轨道，轨道会自动拉伸，但始终会保持我们定义网格时候的轨道个数。

### 自动填充网格轨道

可以通过 repeat 方法，配合 auto-fill 和 auto-fit 属性，创建类似弹性盒的效果，同时保证内容严格按照行和列的固定规则排序。

repeat 方法中使用 auto-fill 属性替换整数值，并且设置轨道的宽度为具体大小。这意味着网格布局将会根据容器的宽度创建列。

```html
<style>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px)
  }
</style>
```

## 作为包含块的网格容器

网格容器成为一个包含块，需要将容器增加 position属性，设置为非 static 的值。

如果再把一个网格项目设置为 position:absolute，那么网格容器就成为了包含块。

如果不设置 grid 的线格布局，则相对于容器布局，如果设置 grid 的线格布局，则相对于设置的线格的左上角布局。

因为该项目了脱离了文档流，所以不会创建额外的轨道，所以设置超出范围的值将不起作用。

```html
 <div class="wrapper">
      <div class="box1">One</div>
      <div class="box2">Two</div>
      <div class="box3">
        This block is absolutely positioned. In this example the grid container is the containing block.
      </div>
      <div class="box4">Four</div>
    </div>
    <style>
      .wrapper {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: 200px;
        gap: 20px;
        position: relative;
      }

      .wrapper>div {
        background-color: orange;
      }

      .box3 {
        position: absolute;
        grid-column-start: 2;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 3;
        left: 40px;
        top: 40px;
      }
    </style>
```


## 网格和 display:contents

display:contents的定义，元素本身不会生成任何盒子，但其子元素和伪元素仍然会像平常一样生成盒子。用户 dialing 为了生成盒子和布局，必须将元素视为已在文档树中被其子元素和伪元素替换。

就像子元素在文档树中上升了一层。

如果将 display:contents 添加到 box1 的样式规则中，则该项目的盒子将消失，子项目成为网格项目，并且应用自动定位规则放置在网格中。

```html
<div class="wrapper2">
      <div class="box1">
        <div class="nested">a</div>
        <div class="nested">b</div>
        <div class="nested">c</div>
      </div>
      <div class="box2">Two</div>
      <div class="box2">Three</div>
      <div class="box2">Four</div>
      <div class="box2">Five</div>
    </div>
    <style>
      .wrapper2 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: minmax(100px, auto);
        gap: 20px;
      }

      .wrapper2>div {
        background-color: bisque;
      }

      .box1 {
        grid-column-start: 1;
        grid-column-end: 4;
        display: contents;
      }

      .box1>.nested {
        background-color: burlywood;
      }
    </style>
```

## auto关键字

auto关键字表示浏览器自己决定长度。基本上等于该单元格的最大宽度，除非当个个设置了 min-width，且这个值大于最大宽度。

```css
grid-template-columns: 100px auto 100px;
```
## 网格线的名称

grid-template-columns 和 grid-template-rows 属性里面，可以使用方括号，指定每一根网格线的名字，方便以后的引用。允许同一根线有多个名字。

```css
    grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
    grid-template-rows: [r1] 100px [r2] 100px [r3 row3] auto [r4];
```

## grid-template-areas属性

网格布局允许指定区域，一个区域由单个或多个单元格组成。grid-template-areas 属性用于定义区域。

多个单元格可以合并为一个区域。如果某一区域不需要利用，则使用.表示。

区域的命名会影响到网格线，每个区域的起始网格线，会自动命名为“区域名-start”，终止网格线自动命名为“区域名-end”。

```css
  grid-template-areas: 'a a b''a a c''a a d';
```

## grid-auto-flow属性

子元素默认的放置顺序是“先行后列”，这个顺序是由grid-auto-flow 属性决定，默认值是 row，即先行后列。也可以设置为 column。

除了可以设置为 row 或 column，还可以设置为 row dense和 column dense。这两个值主要用于，某些项目指定位置以后，剩下的项目怎么自动放置。

## 对齐

justify-items设置单元格内容的水平位置，align-items 设置单元格内容的垂直位置。

start，end，center，stretch。

place-items 是两个属性的缩写，align-items，justify-items。

```css
    .place {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 100px;
      gap: 20px;
      align-items: stretch;
      justify-items: end;
      place-items: center start;
    }
```

## 容器对齐

justify-content是整个内容区域在容器里面的水平位置，align-content 是整个内容区域的成垂直位置。





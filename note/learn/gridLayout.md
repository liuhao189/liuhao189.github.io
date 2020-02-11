# CSS网格布局

## 简介

CSS网格布局引入了二维布局系统，可用于布局页面主要的区域布局或小型组件。


## 什么是网格

网格是一组相交的水平线或垂直线，它定义了网格的列和行。我们可以将网格元素放置在这些行和列相关的位置上。

特点：

1、固定的位置和弹性的轨道大小，可以使用像素单位，可以使用百分比，也可以使用专门的新单位fr 来创建有弹性尺寸的网格。

2、元素位置。可以使用行号、行名或标定一个网格区域来精确定位元素。网格同时还是有一种算法来控制未给出明确网格位置的元素。

3、创建额外的轨道来包含元素。可以使用网格布局定义一个显式网格，但是根据规范它会处理你加在网格外面的内容。

4、对齐控制。网格包含对齐特点，以便我们可以控制一旦放置到网格区域中的物体对齐，以及整个网格如何对齐。

5、控制重叠内容，对个元素可以放置在网格单元格中，或者区域可以部分地彼此重叠，使用 z-index 属性来控制重叠区域显示的优先级。

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

多轨道的大型网格可使用 repeat 标记来重复部分或整个轨道列表。

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

网格使用 minmax 函数来解决这个问题，我们用 minmax 作为 grid-auto-rows 的值。创建行高最小为 xxpx，最大为 auto。用 auto 意味着行的尺寸将会根据内容的大小来自动变换。

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
  </style>s
```


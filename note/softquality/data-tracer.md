# 数据埋点的基础认识

# 前言

数据埋点，对于产品迭代而言，有很重要的指导意义。

数据分析是我们获得需求的来源之一，通过对数据的比对，对数据趋势的分析，能让我们发现哪些环节存在问题，哪些环节有提高空间，同时，数据分析也是检验功能是否有效，是否受欢迎的重要佐证。

以 APP 举例：主要分为四个层级，表层是 UI 层，手机层，服务器层，底层是数据表和日志。

数据埋点的发生场景便是在表层 UI 层里，其作用是监控用户在 UI 层产生的行为，也就是用户对界面的操作。


# 基础认识

数据埋点可以分为两大类，页面统计和行为统计。

## 页面统计

页面统计可以知晓某个页面被多少人访问了多少次，本质是监控页面加载的行为。除了访问的人数与次数，也可以监控到用户在某个页面停留的时长。

## 行为统计

行为统计是指用户在界面上的操作行为，应用最为广泛的便是按钮的点击次数。

# 应用知识

数据分析是一门很复杂的学科，

## 页面统计-页面访问率

APP 里，有的页面是存在唯一的主次关系，B 页面仅能通过 A 页面进入。结合两个页面的访问数值，就能得到 A 页面到 B 页面的转化率。

eg：微信的，某人的相册，访问率低。

可能性：

1、A 页面的转换部分设计有问题，可能需要优化入口的设计。

2、B 页面留存有问题，无法让用户产生二次访问行为，以及无法让用户形成更高频率的访问。复购率和复购频次。

一些基础的功能，往往被多个页面应用，也能通过两个以上的页面进入，也就是我们熟知的多个入口的概念。

可以借助指定入口页的访问人数、入口按钮的点击人数来判断页面的转化率。

广告转化率提升的设计方法，此类型产品，几乎不考虑复购问题，其追求目标是最大限度，在不影响原有用户体验的基础之上，提高用户点击广告的概率。

与之对应的产品设计方法，更多的在于视觉的设计，类似加粗，图片，特殊形状，诱惑性的文案等。

# Service-Worker缓存实践
# 背景

开发的Web App的首字节时间(TP90)，可交互时间(TP90)，完全加载时间(TP90)比较长，严重影响用户体验。

      TP90：TP=Top Percentile，完全加载时间TP90为3s，
      即90%的用户完全加载时间小于3s。10%的用户的完全加载时间大于3s。

## 背景拓展
  
Web App性能主要包括两个点：

1、有意义首屏时间(FMP)或加载性能，改进方法主要包括缓存资源(Cache)，资源动态加载(Lazy Load)，资源合并内联(Sprite)，骨架屏(skeleton)，闪屏图(splash screen)，服务器端渲染(SSR)。

2、运行时性能，主要在于DOM，动画，复杂计算。DOM要减少DOM数量，降低嵌套层级，页面或步骤拆分。动画，独立层，使动画操作只进行层合成即可。复杂计算转移到Web Worker或服务器。

# 问题定位&&方案

很好判断是资源加载问题，需要增加资源缓存。

Service Worker在PC端的支持已经很好(94.99%)，对于不支持Service Worker可以完美降级到HTTP缓存，

## 缓存策略

缓存主要涉及两个问题：1、缓存内容；2、缓存命中率；3、缓存内容删除策略。

### 缓存策略分类

1、永久缓存，到存储空间阈值后按访问时间删除。

2、版本缓存，每次新版本发布后删除上一个版本缓存。

3、上一次缓存，收到请求时直接返回缓存结果，同时请求服务器，用新响应更新缓存。

4、基于时间的缓存，收到请求时校验缓存时间是否过期，过期请求服务器，返回影响，并更新缓存。

请求资源分类：

![资源缓存策略分类](/note/assets/imgs/cacheTypes.png)



## Service Worker代码讲解

Service Worker的基本使用方法大家自行百度吧。下面只说一下基本流程&&原理。

代码流程：
1、页面代码流程
![主线程流程](/note/assets/imgs/mainProcess.png)

2、Service Worker代码流程

![Service Worker 代码流程](/note/assets/imgs/workerProcess.png)

# 效果评估

性能监控上指标首字节时间(TP90)提高40%，可交互时间(TP90)50%，完全加载时间(TP90)提高40%。TP95时间平均提高80%。

对于低频接口的提速，数据上暂未统计，理论上应该提高更多，因为接口来自应用服务器，资源来自于CDN。

# 参考文献

暂无
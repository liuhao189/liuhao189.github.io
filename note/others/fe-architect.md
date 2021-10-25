# 前端架构师的思考

首先，前端架构师肯定是掌握好基本的前端技术基础的，正所谓一专多长，首先你得先精通一门。其次，掌握好前端技术的同时，还要了解前端技术之外的技能。跳出这个思维，才能看到更多。

## 跨界

如果你只会写前端页面，无论你的功力练到多么炉火纯青的地步，那么也只能称你为一个HTML高手。

真正的架构师是需要有跨界的能力的，随着技术的持续完善，单纯技术架构升级的情况越来越少。而架构层面新的变化来自岗位对自身工作内容、职责的重新定义，也就是岗位边界。并不是你做为一个前端开发岗位，你就不能干前端之外的事，要尝试跳出边界来思考和解决问题。

例子：页面的秒开是衡量前端优化的一个重要指标。可以为三个方面入手：

1、Web加载性能优化相关，静态资源缓存，懒加载，懒渲染等。

2、服务器入手，SSR。可以利用nodeJs向后端靠。

3、客户端入手，优化H5页面的启动耗时，离线包，webview预加载&预渲染，从webview入手向客户端靠。

例子：用户交互体验，也是衡量前端优化的重要指标。可以从三个方面入手：

1、Web动画&交互性能优化，避免动画重排&重绘，合成层动画，虚拟列表等。

2、客户端优化，将页面渲染客户端化(RN&Weex&小程序)。

合理的跨界，可以让架构师对整体有深层次的认识，针对各种问题可以提出非前端之外的解决方案。

## 不断学习新技术

技术是不断发展的，作为架构师，不断学习新技术是非常重要的。要对技术保持一定的热情，不能只满足于现状。

1、学惯了jQuery开发页面，不妨试试Vue&React。

2、写了很久的ES5代码，学学ES6也不错。

3、沉醉在HTML，CSS，JS开发页面，不妨学学flutter。

4、打造高性能的Web App，试试Service Worker。

5、从HTTP协议出发，改造升级SPDY和HTTP2，尝试一下HTTP3。

可以从前端角度出发，不断深入，保持对每一个新技术的求知欲，是一名架构师必不可少的。

## 工具和平台化建设

只会写代码的程序员只能叫码农。当技术达到一定的高度时，能够为业务再次提升的能力就会逐渐变少。那么我们不如跳出技术本身，来改善业务周边的工具平台，同样来为业务服务。

举几个工具平台的例子：

1、针对开发调试，需要有一些提升开发效率的工具。例如移动web常用的fiddler，或者是小程序模拟器。

2、针对性能优化，需要有一些能够进行压力测试，发布后线上回归测试的工具，例如腾讯的wetest等。

3、针对统计分析，每个业务都需要能够提供给产品人员观察数据的工具，由于数据的敏感性，一般每个团队有内部的工具。

工具平台主要就是围绕我们的研发流程中的每一步关键节点去建设起来的，结合起来说，我们可以称之为工程化。工程化对前端来说是一个很明确的发展方向，其实工具平台的完善过程就是架构工程化的推进过程。

![工具和平台化流程节点](/note/assets/imgs/fe-tool-platform.png)

身为架构师，你需要有敏锐的嗅觉来洞悉这些节点，并且在适当的时机能够做出对业务有提升的工具平台。要做到遇到重复性的问题时，想想是不是开发出一款自动化工具平台来处理，这才是代码之外对业务提升解决方案。

## 流程和规范化

身为一名架构师，对流程的制定和规范，是非常重要的。不要小瞧规范的威力，可以极大地提升开发效率，真正优秀的规范不会让使用者感到约束，而是帮助他们快速定位问题，提升效率。

这里的规范，可以分成：

1、结构的规范：项目的代码结构，不管前后端，合理的分层和组件化是非常必要的。eg：代码重复度，组件行数限制。

2、编码的规范：这里主要就是代码CodeReview，定期的CodeReview的同时，最好可以使用一些自动化工具。eg：ESLint，TS的应用。

3、流程的规范：项目的评审，研发，测试，发布这些阶段都需要有流程来约束，这些需要结合自身团队的实际情况来制定。

4、规范的落地：对于规范来说最关键的是执行落地，制定完规范的同时，要不时的回顾是否切实的落地，这个应该是团队里每个成员坚持的基本准则。

## 方法论

所谓的方法论，可能说起来比较抽象，这里的方法论，主要是指在完成一项小的需求或承接一个重大的项目，在具体的实施过程中，要有一定的方法和技巧。

性能优化，如何证明优化是有效果的。

1、优化前，需要找到问题的现状，并且要有数据能够佐证优化前的状态。所以要学会收集数据。

2、有了数据后，进行数据分析的同时，就需要找出问题出现的原因，并且付诸实施解决。这个阶段，就需要记录具体的优化原理。

3、优化之后，就要想方设法去验证，并且在验证过程中，同样需要收集数据。

有了优化前数据，优化的原理，优化后的数据，通过数据对比，我可以佐证这次优化是有成效的，并且可以做出一份很漂亮的总结。

每次优化都有数据佐证，这就是性能优化的方法论。

## 安全意识

对于一个业务而言，安全是第一要素，就好比一个国家，安全稳定才是发展一切的前提。一旦业务出现安全问题，代价是非常惨重的。所以作为一名架构师，必须保证业务的稳定性。

1、对于低级的代码安全问题，要坚决杜绝。eg：xss，csrf等。

2、对大型运营类活动需求，要有容灾意识和备份。eg：准备一套方案的同时，要有可选的备选方案。

3、尝试使用工具化来解决和预防安全问题。eg：BAT这种大型企业，在运维和代码层面，都有一层保障机制。

## 团队合作

没有完美的个人，却有完美的团队。时刻保持和团队人员的沟通是必不可少的，这些沟通不限于日常的文字，会议，甚至私下的团建活动，都是可以相互了解的。

团队合作的目的是让团队中的每个人都能明确自己的职责，并发挥出最大的价值。架构师有义务来维护这种合作关系。

## 误区和总结

1、架构师并不等于全栈工程师。

2、架构师切记完全脱离代码，但是也不要一直闷头写代码。

3、架构师应当跳出技术本身，从全局的角度来看新的业务，发现并解决问题。

4、任何项目的架构都不是一成不变的，应该不断迭代和演讲，架构师需要保证架构的创新性。


## 参考文档

https://www.zhihu.com/question/24092572

https://www.zhihu.com/question/434892433/answer/1633771623
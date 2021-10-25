# 大型项目前端架构浅谈

## 综合

本篇文章不会侧重于具体技术实现，而是尝试从更高角度出发，分析为什么要这么做，这些设计能解决什么问题，成本和收益如何。

前端项目的规模不同，成本收益比会有所差别。通常来说，人员越多，项目复杂度越高，那么收益/成本的比值越大。

## 核心思想

1、解决问题。前端架构的设计，应是用于解决已存在或者未来可能发生的技术问题，增加项目的可管理性，稳定性和扩展性。

2、人效比。需要额外开发工作量的事务，应该考虑两个因素。1、花费的人力成本；2、未来可能节约的时间和金钱，避免的项目风险与资产损失，提高对业务的支撑能力以带来业务上可衡量的更高的价值。

3、定性和定量。一定要有可衡量的意义。最好是定量的，至少是可以定性的。eg：增加安全性降低风险。

4、数据敏感。数据作为依据是非常重要的。只有数据，特别是跟钱相关的数据，才是最有说服力的东西。

## 切入角度

1、基础层，偏基础设施建设，与业务相关性较低。

2、应用层，更贴近用户，用于解决某一个问题。

很多内容，并不仅仅只属于前端领域，有很多内容是复合领域，因此需要负责架构的人，技术栈足够全面，对未来的发展有足够的前瞻性。

## 基础层设计

### 自建gitlab

方便管理，包括代码管理，权限管理，提交日志查询，以及联动一些第三方插件。

意义：公司代码是公司的重要资产，使用自建gitlab可以有效保护公司资产。

### 版本管理

几个关键点：

1、版本发布后锁死代码，一般使用tag，否则会导致版本管理混乱。

2、全自动流程发布，避免开发者提交，手动编译打包等操作。开发人员不和相关环境直接接触。

3、多版本共存，发布0.0.2版本后，0.0.1版本的代码仍保存在线上。方便回滚。

意义：提高项目的可控性。

### 自动编译发布Jenkins

代码发布后，执行一系列流程。eg：编译打包合并，发布到CDN或静态资源服务器等。

意义：让研发人员专心于研发，和环境，运维编译打包等事情脱钩。

### 纯前端版本发布

纯前端发布分两步：

1、发布资源，发布JS，CSS，IMG等静态资源。

2、通过配置工具或更新HTML，将html中引入的资源，改为新版本。

解决的问题：前端需要发布新版本时，不依赖于后端。

意义：提高发布效率，降低发布带来的人员损耗，前端版本回滚时，速度更快。

### 统一脚手架

适用场景：有比较多独立中小项目。

好处：

1、可以减少开发人员配置脚手架带来的时间损耗。

2、统一项目结构，方便管理，降低项目交接时带来的熟悉项目的时间。

3、方便统一技术栈，可以预先引入固定的组件库。

意义：

提高开发人员在多个项目之间的快速切换能力，提高项目可维护性，统一公司技术栈。

### Node中间层

适用场景：需要SEO且前端使用React，Vue等框架，主要是服务器端渲染；前端介入后端逻辑，直接读取后端服务或数据库；BFF，Node作为接入层，整合接口。

SEO：很多公司已经不做了，但通常认为，还是有一定意义的。

前端读取后端服务&数据库：提高前端的开发效率和对业务的支持能力。

意义：让前端可以侵入后端领域，质的提升对业务的支持能力。

### 埋点系统

前端埋点的好处：

1、记录每个页面的访问量；

2、记录每个功能的使用量；

3、图表化显示，方便给其它部分展示。

埋点系统是前端高度介入业务，把握业务发展情况的一把利剑。通过这个系统，我们比后端更深刻的把握用户的习惯，以及给产品经理、运营等人员提供准确的数据依据。有了数据以后，前端人员可以针对性的优化功能、布局、页面交互逻辑、用户使用流程。

意义：数据是公司的重要资产，数据也可以洞察用户行为。

### 监控和报警系统

监控和报警系统主要监控线上运行的情况。

1、当访问量有比较大的变化时，自动触发报警。

2、报错量大幅度上升，触发报警。

3、一段时间内没有任何访问量，触发报警。

4、每过一段时间，自动汇总访问者/错误触发者的相关系统。

意义：提高项目的稳定性，提高对业务的把控能力。降低资产损失的可能性，提前发现某些线上故障。

### 安全管理

前端的安全管理，通常都依赖于后端。

1、XSS注入，对用户的输入，进行转码。

2、https，安全协议，CSP，避免注入的脚本图片等内容。

3、CSRF，server端加入CSRF的处理方法，token，cookie设置为httponly，samesite。

意义：减少安全漏洞，避免用户收到损失，避免遭受恶意攻击，增加系统的稳定性和安全性。

### ESLint

好处：

1、降低低阶bug出现的概率，eg：拼写错误

2、增加代码的可维护性，可阅读性。

3、硬性统一代码风格，团队协作起来时更轻松。

意义：提高代码的可维护性，降低团队协作的成本，避免低级bug。

### 灰度发布

大型项目发布时的常见方法，指在发布版本时，只允许小比例，若出现问题，可以快速回滚使用老版本，适用于主链路和访问量极大的页面。

好处：

1、生产环境比测试环境复杂，灰度发布可以在生产环境小范围观察新版本是否可以正常运行，即使出问题，也可以控制损失。

2、对于大版本更新，可以先灰度一部分，观察埋点效果和用户反馈。

3、需要验证某些想法时，可以先灰度一部分，快速验证效果如何，然后查漏补缺或针对性优化。

灰度发布通常分为多个阶段：1、1%；2、5%-10%；3、30-50%；4、全量推送。要留有一部分逻辑，让内部用户可以访问到灰度版本。

意义：降低风险，提高发布灵活度。

### 前后端分离

分配前后端管控的领域。

中小项目常见的情况是后端只提供接口和让某个url指向某个html，前端负责html，css，js等静态类资源。

大型项目不建议这么做，建议前端负责除html以外的静态资源，而html交给后端处理。优点：

1、后端进行渲染，方便统一插入一些代码和资源。eg：埋点，监控，国际化文本资源，页面标识符等。

2、当页面需要统一的头尾时，前端不应该关注与当前页面无关的东西。

3、某些东西，如果通过html来管理，耦合性太高了，违背了解耦和分离的原则。

4、前端版本发布在后端引入某种功能模块后，可以从单独的页面控制前端发布内容，比更新html更方便，也利于灰度发布。

意义：更规范地进行页面管理，降低页面和功能的耦合度，减少复杂页面的环境配置时间。

### Mock

Mock也是常见的前端系统之一，用于解决在后端接口未好时，生成返回的数据。

意义：在前后端并行开发时，降低沟通交流成本，方便开发完毕后直接对接。

### 定期备份

备份是常被忽略的一件事情，但当我们遇到毁灭性场景时，缺少备份带来的损失是非常大的。eg：服务器损坏，触发某个致命的bug或误操作，数据库出现错误操作或出现问题。

必须考虑这种极端情况的发生，常见方法是定期备份、多机备份、容灾系统建设等。

意义：避免在遭遇极端场景时，给公司带来不可估量的损失。

## 应用层设计

### 多页和单页

除了特殊场景，通常推荐使用多页架构。

1、多页项目，页面和页面之间是独立的，不存在交互，因此当一个页面需要单独重构时，不会影响其它页面。对于有长期历史的项目来说，可维护性，可重构性很重要。

2、多页项目的缺点是页面之间切换时，会有白屏时间，通常来说，这个时间不长，可以接受。

3、多页项目可以单次只更新一个页面的版本，而单页项目如果其中一个功能模块更新，很容易让所有页面都需要更新版本。

4、多页项目的版本控制更简单，需要页面拆分，调整部分页面的使用流程，难度会更低。灰度发布更友好。

意义：降低长期项目迭代维护的难度。

### 以应用为单位划分前端项目

在项目比较大时，将所有页面的前端文件放入到一个代码仓库里，存在很多问题：

1、极大增加代码的维护程度。项目会变得丑陋。

2、不方便权限管理，容易造成页面误更改或代码泄密。任何人都有权限改其它人的页面。

推荐以应用为单位进行开发，发布。优点：

1、方便进行管理，当某个业务有需求变更时，可以只给该业务研发人员开develop权限。

2、在需要发布某业务时，只需要发布该业务的所属应用。

3、关注点分离，只维护一块业务，其它公用部分以npm包的方式引入，降低维护成本。

意义：规范项目；增加代码的安全性，降低项目维护成本。

### 基础组件库的建设

设计组件库的前提是，统一技术栈，这样才能最大化基础组件库的效益。组件库建议使用一下参考标准：

1、使用TS。

2、可扩展性强。

3、使用程度高。

4、文档清晰详细。

5、版本隔离，小版本优化加功能，大版本需要大版本更新。

6、和UI协调统一，要求UI交互参与进来。

需要专人维护，有一定的成本。

意义：统一不同产品之间的风格，给用户更好的体验；减少单次开发中写UI组件时浪费时间和人力，提高开发效率。

### 技术栈统一

前端有三大主流框架以及各种第三方库，UI框架。项目如果多一些，很容易形成大杂烩，因此前端的技术栈必须统一。

1、三大框架选其一。

2、需要兼容IE8或更老版本，建议使用jQuery。

3、组件库自建或统一选择一个固定的第三方。

4、一些特殊的第三方库统一使用一个版本。eg：echarts

5、基础设施建设应该避免重复造轮子，所有团队尽量共用，并有专门的前端平台负责统一。特殊需求，可以新建，但应当有说服力。

意义：技术栈统一，可以有效提高开发效率，降低重复造轮子产生的成本。方便招聘，简化团队成员培养成本，以及提高项目的可持续性。

### 浏览器兼容

常见的问题是IE低版本和一些小众浏览器产生的奇怪问题。应该统一解决方案，避免bug的重复产生。常见解决方案有：

1、配置postcss，让某些css增加兼容性前缀。

2、规范团队代码，使用更稳定的写法。

3、对常见问题、疑难问题、总结解决方案并团队共享。

4、建议或引导用户使用高版本浏览器。

意义：避免因浏览器环境产生bug；排查此类bug所浪费的大量时间。

### 内容平台建设

提高公司内部的沟通效率，总结经验，以及保密原因。应建设一个内部论坛+博客。好处是：

1、可以记录公司和团队的历史。

2、研发同学之间分享经验。

3、总结转载一些外界比较精品的文章，提高大家的眼界。

4、增加公司内部同学的交流，有利于公司的团队和文化建设。

意义：博客增强技术积累；论坛增强公司内部沟通的能力。

### 权限管理平台

专门的平台来管理，规范用户的权限以及可访问的内容。

权限管理平台的几个特点：

1、自动化流程控制，用户创建，申请，审批，离职删除等功能。

2、权限有时效性，避免永久权限的产生。

意义：使公司内部流程正规化，信息化。

### 登录系统设计

SSO：用户在一处登录，就可以在任何页面访问，登出时，也同样在任何页面都失去登录状态。

1、增强用户体验。

2、打通不同业务系统之间的用户数据。

3、方便统一管理用户。

意义：用户体验增强，打通不同业务之间的间隔，降低开发成本和用户管理成本。

### CDN

前端资源的加载速度是衡量用户体验的重要指标之一。

意义：增加用户访问速度，降低网络延迟，带宽优化，减少服务器负载，增强对攻击的抵抗能力。

### 负载均衡

通常使用nginx比较多，负载均衡优点：

1、降低单台Server压力，提高业务承载能力。

2、方便应对峰值流量，扩容方便。

3、增强业务的可用性，扩展性，稳定性。

意义：增强业务的可用性、扩展性、稳定性。

### 多端共用一套接口

同一个业务，同时有PC页面和H5页面，最好多端共用一个接口。

一般方案是：

1、后端提供的接口，应该同时包含PC和H5的数据。

2、接口应当稳定，业务变更时，尽量采用追加数据的形式。

3、只有在单独的一端需要特殊业务流程时，才设计单端独有接口。

意义：降低开发工作量，增强可维护性。

## 总结

应按照公司规模、项目进展、人员数量等，先添加比较重要的功能和设计，并需要考虑长期项目的可维护性和发展需要，对部分基础设施进行提前研发设计。

## 参考文档

https://zhuanlan.zhihu.com/p/67034025
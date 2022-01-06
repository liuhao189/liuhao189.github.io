# 系统架构的一些原则 

## 原则一，关注于真正的收益而不是技术本身

对于软件架构来说，我觉得第一重要的是架构的收益，如果只是为了技术而技术，没有太大意义。

下面几个收益比较重要：

1、是否可以降低技术门槛加快整个团队的开发流程。能够加快整个团队的工程流程，快速发布，是软件工程一直在解决的问题。系统架构需要能够进行并行开发，并行上线和并行运维，而不会让某个团队成为瓶颈点。

2、是否可以让整个系统可以运行得更稳定。要让整个系统可以运行得更为稳定，提升整个系统的SLA，就需要对有计划和无计划的停机做相应的解决方案。

3、是否可以通过简化和自动化降低成本。最高优化的成本是人力成本，人的成本除了慢和贵，还有经常不断的human error。如果不降低人力成本，反而需要更多的人。除此之外，是时间成本和资金成本。

如果一个系统架构不能在上面三件事上起作用，那就没有意义了。

## 原则二，以应用服务和API为视角，而不是以资源和技术为视角

国内很多公司都会有很多分工，基本上会分成运维和开发。运维又会分成基础运维和应用运维，开发则会分成基础核心开发和业务开发。

不同的分工会导致完全不同的视角和出发点。eg：基础运维和开发的同学更多的只是关注资源的利用率和性能，而应用运维和业务开发则更多关注的是应用和服务上的东西。

现如今，因为分布式架构的演进，导致有一些系统已经说不清楚是基础层的还是应用层的了。eg：服务治理，需要底层基础技术，也需要业务同学的配合。k8s，需要网络技术，业务配合的readniess和liveness的健康检查。

DevOps，很多技术和组件已经分不清是Dev还是Ops的了，所以，需要合并Dev和Ops。

而且，整个组织和架构的优化，已经不能通过调优单一分工或是单一组件能够有很大提升的了。需要一直自顶向下，整体规划，统一设计的方式，才能做到整体的提升。

而为了做到整体的提升，需要所有人都要有一个统一的视角和目标。要站在服务和对外API的视角来看问题，而不是技术和底层的角度。

## 原则三，选择最主流和成熟的技术

技术选型是一件很重要的事，技术一旦选错，会导致整个架构需要做调整。

过去几年内，当系统越来越复杂时，用户把它们的PHP，python，.NET或Nodejs的架构迁移到Java+Go的架构上的案例不断地发生。

1、尽可能的使用更为成熟更为工作化的技术栈，而不是你自己熟悉的技术栈。看主流大公司实际在用的技术栈，会更靠谱一些。

2、选择全球流行的技术，而不是中国流行的技术。国际化得选择会更好，不要被特别案例骗过去了，关键看解决问题的思路和采用的技术是否具有普适性。

3、尽可能的使用红利大的技术，而不是自己发明轮子，更不要魔改。这个时代不是自己干所有事的年代了，这个时代要想尽方法跟整个产业，整个技术社区融合和合作，这样才会有最大的收益。

4、绝大多数情况下，如无非常特殊要求，选JAVA基本是不会错的。Java的业务开发的生产力是非常好的，而且有框架保障，代码很难写烂。各种框架和技术都容易获取到。架构风险和架构的成本从长期来看是最优的。

## 原则四，完备性会比性能更重要

好多公司的架构师做架构的时候，首要考虑的是架构的性能能撑得住多大的流量，而不是系统的完备性和扩展性。eg：一开始使用mongoDB和redis这样的非关系型数据库，join有问题，开始冗余数据。开始出现数据一致性的问题。

1、使用最科学严谨的技术模型为主，并以不严谨的模型作为补充。

2、性能上的东西，总是有很多解的。性能上的事，总是有很多解的，手段也是最多的。这个比起架构的完备性和扩展性来说真的不必太过担心。

## 原则五，制定并遵循服从标准、规范和最佳实践

只有服从了标准，你的架构才能够有更好的扩展性。eg：很多公司的系统没有服从业界标准，也没有形成自己的标准，典型的如HTTP调用的状态返回码。

有人推荐无论成功还是失败，大家都喜欢返回200，然后在body里指出是否error。这样做，最大的问题是监控系统将在一种低效的状态下工作。需要解包，而且不知道是服务器出错还是客户端出错。

还有一些公司，整个组织没有一个统一的用户ID的设计，各个系统之间同步用户的数据是通过用户的身份证ID。这个公司的用户隐私管理有很大的问题。

标准和规范：

1、服务间调用的协议标准和规范。这其中包括Restful API路径，http方法，状态码，标准头，自定义头，返回数据JSON Schema

2、一些命名的标准和规范，这其中包括，用户ID，服务名，标签名，状态名，错误码，消息，数据库等。

3、日志和监控的规范，日志格式，监控数据，采样要求，报警等。

4、配置上的规范，包括，操作系统配置，中间件配置，软件包等。

5、软件和开发库版本统一。

Restful API的规范，我觉得是非常重要的。Restful API 有一个标准和规范最大的好处就是监视可以很容易地做各种统计分析，控制系统可以很容易的做流量编排和调度。

服务调用链追踪。对于服务调用链追踪来说，目前有很多的实现，最严格的实现是Zipkin，无状态，快速地把 Span 发出来，不消耗服务应用侧的内存和 CPU。

软件升级，一个公司至少一年要有一次软件版本升级的review，然后形成软件版本统一和一致。这样会极大简化系统架构的复杂度。

## 原则六、重视系统扩展性和可运维性

很多技术人员只考虑当下，从不考虑系统的未来扩展性和可运维性，所谓的管生不管养。

所谓的扩展性，意味着，我可以很容易地加更多的功能，或是加入更多的系统。要求有标准规范且不耦合具体的业务架构。

所谓的可运维，就是我可以对线上的系统做任意的变更。要求的是可控的能力，一组各式各样的控制系统。

1、通过服务编排架构俩降低服务间的耦合。eg：业务流程的专用服务，或workflow等这类的中间件来降低服务间的依赖关系。

2、通过服务发现或服务网关来降低服务依赖所带来的运维复杂度。

3、一定要使用各种软件设计的原则。eg：SOLID原则，IOC/DIP，SOA或Spring Cloud等架构的最佳实践。

## 原则七、对控制逻辑进行全面收口

所有的程序都会有两种逻辑。

1、业务逻辑，完成业务的逻辑。

2、控制逻辑，控制逻辑是辅助，eg：多线程，分布式，数据库还是文件，如何部署，配置，运维，监控，事务发现，服务发现，弹性伸缩，灰度发布，高并发。

控制逻辑的技术深度通常会比业务逻辑要深一些，最好要专业的程序员来负责控制逻辑的开发，统一规划统一管理，进行收口。

1、流量收口，流量网关，开发框架SDK或Service Mesh这样的技术。

2、服务治理收口，包括服务发现，健康检查，配置管理，事务，事件，重试，熔断，限流。主要通过开发框架SDK。

3、监控数据收口，包括日志、指标、调用链。主要通过一些标准主流的探针，再加上后台的数据清洗和数据存储来完成。在一个地方进行并联。

4、资源调度有应用部署的收口，包括计算、网络和存储的收口，主要通过容器化的方案。

5、中间件的收口，包括数据库，消息，缓存，服务发现，网关等。


重要的原则：

1、你要选择容易进行业务逻辑和控制逻辑分离的技术。Java 的 JVM+字节码注入+AOP 式的Spring 开发框架，会带给你太多的优势。

2、你要选择可以享受“前人种树，后人乘凉”的有技术红利的技术。如：有庞大社区而且相互兼容的技术，如：Java, Docker,  Ansible，HTTP。

3、中间件你要使用可以 支持HA集群和多租户的技术。这里基本上所有的主流中间件都会支持 HA 集群方式的。


## 原则八，不要迁就老旧系统的技术债务

很多公司有非常大的技术债务：

1、使用老旧的技术，eg：http 1.0，Java 1.6。

2、不合理的设计。eg：gateway中写大量的业务逻辑，单体架构，数据和业务逻辑深度耦合。错误的系统架构。

3、缺少配套设施，eg：没有自动化测试，没有好的软件文档，没有质量好得代码，没有标准和规范等。

找合理化的理由：历史原因和不得不为之的理由。很多公司，都会在原来的技术债上进行更多的建设，然后，技术债越来越大。

原则：

1、与其花大力气迁就技术债务，不如直接还技术债。所谓的长痛不如短痛。

2、建设没有技术债的新城区，并通过防腐层的架构模式，不要让技术债侵入新城区。

## 参考文档

https://coolshell.cn/articles/21672.html
# IM保证在线实时消息的可靠投递

## 保证在线实时消息的可靠投递

消息的可靠性，即消息的不丢失和不重复，是IM系统中的一个难点。

## 报文类型

IM的客户端与服务器通过发送报文来完成消息的传递。

报文分三种：1、请求报文Request(简称R)；2、应答报文Acknowledge(简称A)；3、通知报文Notify(简称N)。

## 普通消息投递流程

用户A给用户B发送一个“你好”。该流程如下：

1、client-A向IM-server发送一个消息请求包msgR。

2、IM-server在成功处理后，回复clientA一个消息响应包，即msgA。

3、如果此时client-B在线，则IM-Server主动向client-B发送一个通知消息msgN。

## 上述流程可能存在的问题

clientA收到IM-Server的响应包，只能说明IM-Server成功接收到了消息。在若干场景下，可能出现msgN丢失，且发送方clientA完全不知道。比如：1、服务器崩溃，msgN未发出；2、网络抖动，msgN被网络设备丢弃；3、clientB崩溃，msgN未接收。

## 应用层确认 + IM消息可靠投递的六个报文

TCP是一种可靠的传输层协议，TCP是如何做到可靠的？答案是：超时、重传、确认。

要想实现应用层的消息可靠投递，必须加入应用层的确认机制。即：要想让client-A确保接收方client-B收到了消息，必须让接收方client-B给一个消息的确认。

1、client-B向IM-Server发送一个ack请求包，ackR。

2、IM-Server在成功处理后，回复client-B一个ack响应包，ackA。

3、IM-Server主动向client-A发送一个ack通知包，ackN。

至此，client-A才能确保client-B真正收到了“你好”。

一个应用层即时通信消息的可靠投递，共涉及6个报文，这就是IM系统中消息投递的核心技术。

## 可靠消息投递存在什么问题？

client-A发送消息的报文丢失，此时直接提示“发送失败”即可，问题不大。

msg:N，ack:R，ack:A，ack:N这四个报文都可能丢失？

## 消息的超时与重传

client-A发出了msgR，在期望的时间内，如果没有收到ackN，client-A会尝试将msgR重发。clientA需要维护一个等待ack的队列，并配合timer超时机制，来记录哪些消息没有收到ackN，以定时重发。

## 消息重传存在什么问题

消息重传可能会导致某端收到多条重复的消息，需要进行去重。

需要发送方生成一个全局唯一的msgId，保存在等待ack队列里，同一条消息使用相同的msgId来重传，供各端去重。

## 其它

1、上述设计理念，由客户端重传，可以包装服务器无状态，架构设计基本原则。

2、如果client-B不在线，IM-Server保存了离线消息后，要伪造ackN发送给client-A。

3、离线消息的拉取，为了保证消息的可靠性，也需要ack机制，先发送offline:R报文拉取消息，收到offline:A后，再发送offlineack:R删除消息。

## 总结

1、IM系统是通过超时、重传、确认、去重的机制来保证消息的可靠传递，不丢不重。

2、切记，一个“你好”的发送，包含上半场msgR/A/N与下半场的ackR/A/N的6个报文。

## 参考文档

http://www.52im.net/thread-294-1-1.html

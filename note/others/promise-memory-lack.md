# Promise的内存泄露

## 问题

Cribl LogStream是一个处理数据的流处理引擎。它主要是接收，处理，发送数据到目标系统。

如果和目标系统通信失败，需要有相关的处理。有一些手段可以处理下游系统不可用：1、停止处理新进的数据，丢弃数据或将数据排入队列以便后续处理。

Cribl LogStream选择了不停地尝试发送数据到下游系统。

代码如下：

```js
function sendWithRetry(data, dest) {
    return dest.send(data).catch(err => {
       return delayMs(100).then(() => {
            return sendWithRetry(data, dest);
        });
    });
}
```

如果dest不可用时间比较长，这个Promise链就会非常长，这会导致内存使用量暴涨。

## 解决方案

解决方案是打破Promise链。因为retryIt不返回Promise，Promise链不会一直扩展。

```js
function sendWithRetry(data, dest){
    return dest.send(data).catch(err => new Promise((resolve)=>{
        function retryIt() {
            delayMs(100).then(()=>{
                dest.send(data).then(()=>{
                    resolve();
                }).catch(err => {
                    retryIt();
                    //Do not return a promise here
                })
            })
        }
        retryIt();
    }))
}
```



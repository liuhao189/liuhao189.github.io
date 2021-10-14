# Web页面错误捕获原理

## JS代码执行错误

主要指JS代码运行时的错误。

```js
window.addEventListener('error', (err) => {
    console.log('addEventListener', err)
}, true);
//同步错误
throw new Error('sync error');
//异步错误
setTimeout(() => {
    throw new Error('async error');
}, 0);
```

## 资源加载错误

DOM元素类的资源加载错误通过监控window的error事件。

```js
window.addEventListener('error', (ev) => {
    //如果ev的target为img或video等标签，可以判断为资源加载错误
});
// <img src="./not-exist.png" /> 
// <video src="./not-exist.mp4" poster="./not-exist-poster.png"></video>
// 图片标签类的加载错误可以捕获到
```

需要注意，window.error事件，CSS里的背景图片和字体文件的请求错误捕获不到。

```html
<style>
    @font-face {
        font-family: 'test-fm';
        src: url('./not-exist.woff');
    }

    //
    body {
        font-family: 'test-fm';
        background-image: url('./not-exist-bg.png');
    }
</style>
```

可以利用performance.getEntriesByType('resource')来获取所有资源的加载时间等信息，但是还是无法监控到资源类的加载错误。

```js
// Type PerformanceResourceTiming
connectEnd: 295.79999999701977
connectStart: 295.79999999701977
decodedBodySize: 0
domainLookupEnd: 295.79999999701977
domainLookupStart: 295.79999999701977
duration: 30
encodedBodySize: 18446744073709552000
entryType: "resource"
fetchStart: 295.79999999701977
initiatorType: "css"
name: "http://xxx.com/not-exist.woff"
nextHopProtocol: "http/1.1"
redirectEnd: 0
redirectStart: 0
requestStart: 297.6000000014901
responseEnd: 325.79999999701977
responseStart: 301
secureConnectionStart: 0
serverTiming: []
startTime: 295.79999999701977
transferSize: 299
workerStart: 0
```

如果使用了ServiceWorker，在ServiceWorker的fetch事件中可以监控到CSS的资源请求错误。

```js
//sw.js
self.addEventListener('fetch', (ev) => {
    fetch(url).then(res => {
        //res.statusCode 404 401 403等，可以上报监控错误
    })
})
```

## HTTP请求错误

Web页面发起HTTP请求主要靠XMLHttpRequest和Fetch两个API，HTTP的请求错误监控主要通过包装XMLHttpRequest对象和Fetch方法来实现。

```js
//主要是劫持原生方法
(function() {
    let originFetch = fetch;
    if (!originFetch) {
        return;
    }
    //
    let newFetch = function() {
        let args = arguments;
        let startTs = new Date().getTime();
        return originFetch.apply(null, args).then(res => {
            let reviceTs = new Date().getTime();
            //在此判断res.status 和res.statusCode，同时从args中取到发送的参数
            let resCopied = res.clone();
            // 从resCopied中获到具体的响应信息
            return res;
        }).catch(err => {
            //监控到错误，可以notifyError了
            throw err;
        });
    };

    fetch = newFetch;
})();
//xmlhttprequest
(function() {
    let originXMLHttpRequest = XMLHttpRequest;
    if (!originXMLHttpRequest) return;

    let originXMLHttpRequestSend = XMLHttpRequest.prototype.send;

    function newSend() {
        let args = arguments;
        //
        console.log(this);
        this.addEventListener('error', (ev) => {
            console.log('xhr error', ev);
        });
        this.addEventListener('timtout', (ev) => {
            console.log('timeout error', ev);
        });
        this.addEventListener('load', (ev) => {
            console.log('xhr load', ev);
        })

        return originXMLHttpRequestSend.apply(this, args);
    }

    XMLHttpRequest.prototype.send = newSend;
})()
//
var oReq = new XMLHttpRequest();
oReq.open("GET", "http://www.example.org/example.txt");
oReq.send();
```

fetch是直接替换fetch方法，XMLHttpRequest是重写XMLHttpRequest.prototype.send方法。

## unhandledrejection

主要通过监听window的unhandledrejection事件即可。

```js
window.addEventListener('unhandledrejection', (ev) => {
    console.error(ev.promise, ev.reason);
})

Promise.reject(new Error(`test promise error`));
```

## console.error

监控console.error报告的错误信息

```js
(function () {
        let originConsoleError = window.console ? window.console.error : null;
        if (!originConsoleError) return;

        function newConsoleError() {
            let args = arguments;
            //获取到console.error的信息
            console.log(args);
            //
            originConsoleError.apply(this, args);
        }

        window.console.error = newConsoleError;
    })()
```

## Websocket连接错误

重写了Websocket连接相关的方法。

```js

```

## 参考文档

https://zhuanlan.zhihu.com/p/123286696

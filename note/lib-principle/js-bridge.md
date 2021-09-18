# JS-Bridge原理

JS-Bridge顾名思义，是连接JS和Native App的桥梁，是Hybrid App里面的核心。一般分为JS调用Native和Native主动调用JS两种形式。

## JS调用Native

在IOS里面需要区分UIWebview和WKWebview两种Webview。WKWebview是ios8之后出现的，目的是取代UIWebview，它占用内存更少，支持更好的HTML5特性，性能更加强大。

### JS调用Native三种方法

#### 方法一 - 拦截请求

类似于JSONP的方式，客户端可以拦截Webview内的请求，解析相关的参数来获取调用的参数和需要执行的回调。

```js
request(`http://app/scan-code?callback=scanCodeCallback1&type=QRCode`);
//解析到app/scan-code，app调起扫码的组件，扫码的结果执行scanCodeCallback1(result)
```

优点：

1、兼容性好，ios6之前只支持这种方式，2021年了，ios6的市场份额非常低，可以不用考虑这条优点。

缺点：

1、URL会有长度限制，一旦过长会出现信息丢失的问题。

鉴于上面的优缺点，现在一般不会使用这种方式。

#### 方法二 - 拦截弹框

这种方式一般是利用alert，confirm，prompt弹窗会触发Webview相应事件来拦截的。

```java
// 拦截 Alert
@Override
public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
       return super.onJsAlert(view, url, message, result);
   }
// onJsConfirm 和 onJsPrompt也类似
```
这种方式的缺点是IOS上的UIWebview不支持，但是WKWebview又有更好的scriptMessageHandler，比较尴尬。

#### 方法三 - 注入JS上下文

这是目前比较常用的方法。

##### IOS侧

IOS WKWebview：通过addScriptMessageHandler来注入对象到JS上下文，前端调用原生方法之后，可以通过didReceiveScriptMessage来接收前端传过来的参数。

通过addMessageHandler注入的对象实际上只有一个postMessage方法，无法调用更多自定义方法。支持直接传JSON对象。

##### 安卓侧

安卓4.2之前注入JS一般使用addJavascriptInterface。

```java
public void addJavascriptInterface() {
        mWebView.addJavascriptInterface(new DatePickerJSBridge(), "DatePickerBridge");
    }
private class PickerJSBridge {
    public void _pick(...) {
    }
}
```

JS端调用：

```js
window.DatePickerBridge._pick(...)
```

在安卓4.2以后，提高@JavascriptInterface注解，暴露给JS的方法必须带上这个。

```java
private class PickerJSBridge {
    @JavascriptInterface
    public void _pick(...) {
    }
}
```

## Native调用JS

Native调用JS一般是直接执行JS代码字符串，类似于JS的eval去执行一串代码。

一般有loadUrl，evaluateJavascript等几种方法，不管哪种方式，客户端只能弄到挂载到window对象的上面的方法和属性。

### 安卓

在安卓4.4之前的版本支持loadUrl。

```java
webView.loadUrl(`javascript:foo()`);
```

在安卓4.4以上的版本一般使用evaluateJavaScript这个API来调用。

```java
if (Build.VERSION.SDK_INT > 19)
{
    webView.evaluateJavascript("javascript:foo()", null);
} else {
    webView.loadUrl("javascript:foo()");
}
```

### IOS侧

UIWebview使用stringByEvaluatingJavaScriptFormString来调用JS代码，这种方式是同步的，会阻塞线程。

WKWebview可以使用evaluateJavaScript方法来调用JS代码。

## JS-Bridge的设计

一般JS端Bridge的基本方法有三个：

1、callHandler(name,params,callback)，调用Native的方法，传参和回调函数名字。

2、hasHandler(name)，检查客户端是否支持某个功能的调用。

3、registerHandler(name)，这个是提前注册一个函数，等待native回调。

### hasHandler

一般客户端维护一个支持的Bridge功能的列表。

```java
@JavascriptInterface
public boolean hasHandler(String cmd) {
        switch (cmd) {
            case xxx:
            case yyy:
            case zzz:
                return true;
        }
        return false;
}
```

### callHandler

调用客户端注入的方法即可。主要是把callback函数包装到一个挂载到window上有唯一名字的函数里，然后把包装方法的名字传给Native App即可。

```js
function callHandler(name, data, callback) {
    const id = `cb_${uniqueId++}_${new Date().getTime()}`;
    callbacks[id] = callback;
    window.bridge.send(name, JSON.stringify(data), callbackId)
}
```

当native app执行相应的功能后，把callbackId和返回的结果传递给JS的onReceive之类的方法(需要JS在全局定义好onReceive方法)。

然后在JS的onReceive方法里处理相应的返回，并执行callHandler的回调方法。


```js
window.bridge.onReceive = function(callbackId, result) {
    let params = {};
    try {
        params = JSON.parse(result)
    } catch (err) {
        //
    }
    if (callbackId) {
        const callback = callbacks[callbackId];
        callback(params)
        delete callbacks[callbackId];
    }
}
```

### registerHandler

注册的流程比较简单，我们把callback函数实现存到一个messageHandler对象里面。

```js
function registerHandler(handlerName, callback) {
    if (!messageHandlers[handlerName]) {
      messageHandlers[handlerName] = [handler];
    } else {
      // 支持注册多个 handler
      messageHandlers[handlerName].push(handler);
    }
}
```

这里需要重新改造下onReceive方法，如果没有callbackId，则说明是Native App主动调用JS注册的方法。

```js
window.bridge.onReceive = function(callbackId, result) {
    let params = {};
    try {
        params = JSON.parse(result)
    } catch (err) {
        console.error(err);
    }
    if (callbackId) {
        const callback = callbacks[callbackId];
        callback(params)
        delete callbacks[callbackId];
    } else if (params.handlerName)(
        // 可能注册了多个
        const handlers =  messageHandlers[params.handlerName];
        for (let i = 0; i < handlers.length; i++) {
            try {
                delete params.handlerName;
                handlers[i](params);
            } catch (ex) {
                console.error(ex)
            }
        }
    )
}
```
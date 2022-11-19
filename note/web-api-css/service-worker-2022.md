# Service Worker API

Service Worker本质上充当Web应用程序、浏览器与网络之间的代理服务器。这个API旨在创建有效的离线体验，它会拦截网络请求并根据网络是否可用来采取适当的动作，更新来自服务器的资源。它提供入口以推送通知和访问后台同步API。

## 概念和用法

ServiceWorker是一个注册在指定源和路径下的事件驱动worker，它采用JS控制关联的页面或网站，拦截并修改访问和资源请求，细粒度地缓存资源。

ServiceWorker运行在worker上下文，因此它不能访问DOM。相对于驱动应用的主JS线程，它运行在其它线程中，所以不会造成阻塞。它设计为完全异步，同步API不能在ServiceWorker中使用。

出于安全考虑，ServiceWorker只能由HTTPS承载，因为修改网络请求的能力暴露给中间人攻击非常危险。

## 注册

使用ServiceWorkerContainer.register方法首次注册service worker。如果注册成功，service worker会下载到客户端并尝试安装和激活，这将作用于整个域内用户可访问的URL或者其特定子集。

## 下载&安装&激活

用户首次访问service worker控制的网站或页面时，service worker会被立即下载。

之后，在以下情况将会触发更新：1、一个前往作用域内页面的导航；2、在service worker上的一个事件被触发并且过去24小时没有被下载。

如果它与现有service worker不同（字节对比），或第一次在页面或网站遇到service worker，如果下载的文件是新的，安装就会尝试进行。

如果是首次启用service worker，页面会首先尝试安装，安装成功后它会被激活。

如果现有service worker已启用，新版本会在后台安装，但不会被激活。这个时序称为worker in waiting。直到所有已加载的页面不再使用旧的service worker才会激活新的service worker。只要页面不再依赖旧的service worker，新的service worker会被激活。

可以使用ServiceWorkerGlobalScope.skipWaiting来避免等待，存在的页面也可以使用Clients.claim来接管。

你可以监听InstallEvent，事件触发时的标准行为是准备service worker用于使用，例如使用内建的storage API来创建缓存，并且放置离线时所需资源。

还有一个active事件，触发时可以清理旧缓存和旧的service worker关联的东西。

Service Worker可以通过FetchEvent事件去响应请求。通过使用FetchEvent.respondWith方法，你可以修改对于这些请求的响应。

注意：因为oninstall和onactivate完成前需要一些时间，service worker标准提供一个waitUntil方法，当oninstall或onactivate触发时被调用，接受一个promise，在这个promise被成功resolve以前，功能性事件不会分发到service worker。

## 使用ServiceWorker

1、service worker URL通过serviceWorkerContainer.register来获取和注册。

2、如果注册成功，service worker就在ServiceWorkerGlobalScope环境中运行，这是一个特殊类型的worker上下文运行环境，与主线程独立，没有访问DOM的能力。

3、service worker现在可以处理事件了。

4、受service worker控制的页面打开后会尝试去安装service worker。最先送给service worker的事件是安装事件，在这个事件里可以开始进行填充IndexDB和缓存站点资源。

5、oninstall事件的处理成功执行完毕后，可以认为service worker安装完成了。

6、下一步是激活，当service worker安装完成后，会接收一个激活事件。onactivate主要用途是清理先前版本的service worker脚本中使用的资源。

7、Service worker现在可以控制页面了，但仅在注册成功后打开的页面，也就是说，页面起始于有没有service worker，且在页面的接下来生命周期内维持这个状态。所以，页面不得不重新加载以让service worker获得完全的控制。

Service worker支持的所有事件：install，activate，message，fetch，sync，push。

## 谈谈代码

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw-test/sw.js', { scope: '/sw-test/' }).then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}
```

单个service worker可以控制很多页面，需要小心service worker脚本中的全局变量，每个页面不会有自己独有的worker。

### service worker注册失败的原因

1、没有在https下加载页面。

2、service worker文件的地址没有写对，需要相对于origin，而不是app的根目录。

3、service worker在不同的origin而不是你的app中，这是不被允许的。


## Cache

Cache接口为缓存request/response对象提供存储机制。一个域可以有多个命名cache对象，你需要再你的脚本中处理缓存更新的方式。

使用CacheStorage.open(cacheName)打开一个Cache对象，再使用Cache对象的方式去处理缓存。

你需要定期地删除缓存条目，因为每个浏览器都硬性限制了一个域下缓存数据的大小。浏览器可能删除一个域下的缓存数据。

备注：使用Cache.put，Cache.add和Cache.addAll只能在GET请求下使用。


### 方法

Cache.match(request,options)，resolve的结果是跟Cache对象匹配的第一个已经缓存的请求。

Cache.matchAll(request,options)，resolve的结果是跟Cache对象匹配的所有请求组成的数组。

request参数：如果忽略该参数，将获取到cache中所有response的副本。

options: ignoreSearch，默认false，是否忽略url中的query部分；ignoreMethod，默认false；ignoreVary，默认false，如果设为true，无论Response对象是否包含vary头，都会认为是成功匹配；cacheName：DOMString，代表一个具体的要被搜索的缓存。

Cache.add(request)，抓取这个URL，检索并把返回的response对象添加到给定的Cache对象。等同于调用fetch，然后使用Cache.put将response添加到cache中。

Cache.addAll(requests)，抓取一组URL数组，检索并把返回的response对象添加到给定的Cache对象。

Cache.put(request,response)，将request和response添加到特定的cache中。

Cache.delete(request,options)，搜索key为request的Cache条目，如果找到，则删除Cache条目，并且resolve(true)，没找到则resolve(false)。

Cache.keys(request,options)，resolve的结果是Cache对象key值组成的数组。


## CacheStorage

CacheStorage接口表示Cache对象的存储，它提供了一个ServiceWorker、其它类型的worker或window范围内可以访问到的所有命名的cache的主目录。

### 方法

CacheStorage.match，检查给定的Reqquest是否是CacheStorage对象跟踪的任何Cache对象的键。

CacheStorage.has，如果存在cacheName，则resolve(true)。

CacheStorage.open，打开cacheName的Cache。

CacheStorage.delete，查找匹配cacheName的Cache对象，找到，则删除Cache对象并resolve(true)。

CacheStorage.keys，返回一个Promise，它将使用一个包含于CacheStorage追踪的所有命令Cache对象对应的字符串数组来resolve。


## 参考文档

https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API

https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers

https://web.dev/navigation-preload/#the-problem

https://developer.mozilla.org/zh-CN/docs/Web/API/Cache
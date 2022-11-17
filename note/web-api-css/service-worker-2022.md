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




## 参考文档

https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API

https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers

https://web.dev/navigation-preload/#the-problem
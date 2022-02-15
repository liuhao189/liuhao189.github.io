# Electron-Session

管理浏览器会话、cookie、缓存、代理设置等。

session模块可用于创建新的session对象。也可以使用webContents的session属性或session模块访问现有页的session。

## 静态方法

session模块具有以下方法：

session.fromPartition(partition:string [,options: {cache:boolean}])，返回session实例。根据partition字符串产生的session实例。

当已存在一个Session具有相同的partition，它将被返回。否则一个新的Session实例根据options被创建。

如果partition以persist:开头，该页面将使用持续的session，并在所有页面生效，且使用同一个partition。

如果没有以persist:开头，页面将使用in-memory-session，如果没有设置partition，app将返回默认的session。

没有办法修改一个已存在的Session实例的options。

## 静态属性

defaultSession一个Session对象，该应用程序的默认session对象。

## Session类

Process:Main，获取和设置Session的属性，此类不从electron模块导出，它只能作为Electron API中其它方法的返回值。

### 实例事件

1、will-download，webContents中下载item的时候触发。

2、extension-loaded，(ev,extension)在扩展插件加载完成后触发。行为包括：1、扩展插件通过Session.loadExtension中被加载；2、扩展插件正在被重新加载，由于崩溃，扩展插件被请求重新加载。

3、extension-unload，扩展插件被卸载后触发，当Session.removeExtension被调用时也会触发。

4、extension-ready，扩展插件加载完成，同时所有必要的浏览器状态也初始化完成，允许启动插件背景页面，将触发此事件。

5、preconnect，渲染器进程已经预链接到URL后触发此事件。 dns-prefetch, preconnect, prefetch, and prerender。

6、spellcheck-dictionary-initialized，字典初始化成功事件。

7、spellcheck-dictionary-download-begin。

8、spellcheck-dictionary-download-success。

9、spellcheck-dictionary-download-failure。

10、select-hid-device，当调用navigator.hid.requestDevice方法时，callback必须带上deviceId。

11、hid-device-added，当新的HID设备变可用时触发。

12、hid-device-removed，当HID设备移除时。

13、select-serial-port，调用navigator.serial.requestPort时触发。

14、serial-port-added。

15、serial-port-removed。

### 实例方法

1、getCacheSize:Promise<number>，当前session会话缓存大小，

2、clearCache:Promise<void>，清除session的HTTP缓存。

3、clearStorageData([options])，options: {origin:'协议://主机名:端口',storages:['appcache','cookies','filesystem','indexed','localstorage','shadercache',
'websql','serviceworkers','cachestorage'],quotas:['temporary','persistent','syncable']}。

4、flushStorageData，写入任何未写入DOMStorage数据到磁盘。

5、setProxy(config)，config: { 
    mode:'direct'|'auto_detect'|'pac_script'| 'fixed_servers'|'system', //没有指定，根据其它选项自动判断。
    direct: 直接模式下，所有连接都是直接创建的，无需任何代理,
    auto_detect，代理配置由PAC脚本决定,
    pac_script，通过pacScript设置的脚本地址,
    fixed_servers，主要通过proxyRules来指定,
    system，代理配置从system取。
    pacScript: URL,
    proxyRules:string,
    proxyByPassRules:string,哪些url可以通过绕过代理
}

6、resolveProxy(url)，解析url的代理信息。

7、forceReloadProxyConfig，强制使用最新的代理配置。

8、setDownloadPath，设置下载目录。

9、enableNetworkEmulation(options)，offline:boolean，latency:number，downloadThroughput:number，uploadThroughput: number。

10、preconnect(options)，url:string,numSockets:number[1,6]的区间，默认为1。

11、closeAllConnections():Promise<void>。

12、disableNetworkEmulation。

13、setCertificateVerifyProc((request,callback)=>{})，每当一个服务器证书请求验证，procHandler将被调用，为session设置证书验证过程。callback(0)接受证书，callback(-2)驳回证书，callback(null)将恢复为默认证书验证过程。

此结果会被network service缓存。

14、setPermissionRequestHandler(handler:(webContents,permission,cb,details)=>{})，用于设置session的权限请求的处理程序，调用callback(true)将允许该权限。

15、setPermissionCheckHandler(handler:(webContents,permissions,requestOrigin,details)=>boolean)，用于返回权限请求的信息。

16、setDevicePermissionHandler(handler:(details)=>boolean)。

17、clearHostResolverCache，清除主机解析程序的缓存。

18、allowNTLMCredentialsForDomains，动态设置是否始终为 HTTP NTLM 发送凭据或协商身份验证。

19、setUserAgent(userAgent[,acceptLanguages])覆盖当前会话的userAgent和acceptLanguages。不会影响现有的webContents，并且webContents.setUserAgent来重写会话范围的userAgent。

20、isPersistent，是否是持续的。

21、getUserAgent，返回userAgent。



## 参考文档

https://www.electronjs.org/zh/docs/latest/api/session
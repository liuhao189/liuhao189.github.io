# Tauri入门篇

## Tauri是什么

Tauri使用Web前端构建更小，更快，更安全的桌面应用程序。Tauri是一个工具包，可以帮助开发者为主要桌面平台(mac，windows，linux等)制作应用程序。几乎支持现有的任何前端框架，其核心是使用Rust编写的。Rust负责系统通信，应用构建，上层应用开发只需要专注于webview中的网页的编写。

## 安全第一

Tarui允许你选择要发布的API端点，是否希望在你的应用程序中内置一个本地主机localhost服务器，甚至可以在运行时随机化功能句柄。

默认情况下Tauri只提供二进制文件，而非asar文件。

## asar

asar可以提高在windows上等平台上读取文件的性能，而不是通过复制其所有源文件来发布您的应用程序。

asar用于将electron应用程序文件连接到一个大文件，为了缓解windows上长路径名问题，稍微加快requie并隐藏源代码不被粗略检查，可以选择将应用程序打包成asar归档文件，而对源代码几乎没有改动。

## 多语言支持

目前，tarui使用Rust作为后端，但在不远的将来，其它后端如Go，Nim，Python，CSharp等也将成为可能。目前官方维护的是Rust与Webview组织的绑定，因为API可以用任何带有C语言互操作的语言来实现，可以选择自己喜欢的语言作为后端。

## Tarui vs Electron

Electron的一个主要好处是可以针对单个浏览器和运行时版本进行开发，而不必处理所有小而耗时的兼容性问题。

Tarui相比Electron放弃了一些兼容性，换来了内存以及应用体积的更小化，在安全方面也做了一些事。

从Tarui的架构来看，它是Webview2和系统之间的一个胶水层，目前后端是Rust实现。Tauri后期可以跨平台到IOS/IpadOS，Android。

|    Detail     |    Tarui    |    Electron    |
| -------------| --------------| -------------|
| Install Size Linux | 3.1M        | 52.1M      |
| Memory Consumption Linux  | 180M  | 462M |
| Launch Time Linux | 0.39s | 0.80s |
| Interface Service Provider| WRY | Chromium|
| Backend Binding | Rust | Node.js |
| Underlying Engine | Rust | V8(C/C++) |
| FLOSS | Yes | No|
|MultiThreading|Yes|Yes|
|Bytecode Delivery| Yes | No|
|Multiple Windows|Yes|Yes|
|Auto Updater|Yes|Yes(Linux not supported)|
|Custom App Icon|Yes|Yes|
|Windows Binary|Yes|Yes|
|MacOS Binary|Yes|Yes|
|Linux Binary|Yes|Yes|
|IOS Binary|Soon|No|
|Androind Binary|Soon|No|
|Desktop Tray|Yes|Yes|
|Sidecar Binaries|Yes|No|


## Tauri架构

Tauri是一个多语言通用工具包，其超期的组合性允许工程师制作各种应用程序。后端使用Rust和系统进行交互，包装成Tauri插件后暴露出JS API供前端使用，通过Webview进行消息传递来控制系统。
不支持的功能，开发人员可以通过编写Rust来扩展默认API。

因为使用操作系统的Webview，它不提供运行时，因为最终的二进制文件是从Rust编译的，使得Tauri应用程序的逆向不是一项简单的任务。

### 核心Core

1、Tauri，把所有东西（运行时、宏、实用程序和API）都集中在一起构成最终产品。在编译时读取tauri.conf.json文件，以引入功能并进行应用程序的实际配置。在运行时处理脚本注入，托管系统交互的API及管理更新。

2、Tauri-runtime，Tarui本身和较低级别的webview库之间的胶水层。

3、taruri-macros，通过利用tauri-codegen create为上下文，处理程序和命令创建宏。

4、tauri-utils，在许多地方重用的通用代码，并提供有用的使用方法，例如解析配置文件，检查平台，注入CSP和管理资源。

5、tauri-build，在构建时应用宏，为cargo装配所需的一些特殊功能。

6、tauri-codegen，嵌入，散列和压缩资源，包括图标。在编译时解析tauri.conf.json并生成配置结构。

7、tauri-runtime-wry，专门为WRY开辟了直接的系统交互，例如打印，显示器检测和其它与窗口相关的任务。

### 上游Upstram

Tauri组织维护了Tauri的两个上游类库，即用于创建和管理应用程序窗口的TAO，以及用于与窗口内的Webview交互的WRY。

TAO：Rust中的跨平台应用程序窗口创建库。支持Windows，macOS，Linux，IOS和Android等所有主要平台。

WRY：WRY是Rust中的跨平台Webview渲染库，支持Windows、MacOS和Linux等所有主要桌面平台。

## Tauri不是什么

Tauri不是一个轻量级的内核包装器，相反，它直接使用WRY和TAO来完成对操作系统进行系统调用的繁重工作。

Tauri不是虚拟机或虚拟机环境，相反，它是一个允许制作Webview OS应用程序的应用程序工具包。
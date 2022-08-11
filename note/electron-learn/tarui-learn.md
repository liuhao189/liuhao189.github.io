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

Tauri是一个多语言通用工具包，其超强的组合性允许工程师制作各种应用程序。后端使用Rust和系统进行交互，包装成Tauri插件后暴露出JS API供前端使用，通过Webview进行消息传递来控制系统。
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


# Tarui开发环境

## MacOS

```bash
xcode-select --install
# install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
#
rustc --version
```

## 初始化项目

```bash
npx create-tauri-app
```

项目结构：

```bash
[tauri-app] 
    node_modules # 前端依赖
    src #前端代码
    src-tauri # Tauri程序源
        icons # 应用程序图标
        src # Tauri App程序源
        target # 构建的产物文件夹
        build.rs # Tauri构建应用
        Cargo.lock # 包含了依赖的进去描述信息，类似于yarn.lock和package-lock.json
        Cargo.toml # Tauri项目清单
        tauri.conf.json # 自定义Tauri应用程序的配置文件
    index.html # 项目主界面
    package.json # 前端项目清单
    tsconfig.json # TS配置文件
    vite.config.ts # Vite配置文件
    yarn.lock # 前端依赖的精确描述
```

## 启动开发环境

启动Web项目，纯前端项目，不和操作系统产生任何交互。

```bash
yarn dev
```

启动tauri项目，需要和操作系统产生交互，如系统文件读写操作。

注意：第一次启动项目比较慢，tauri会根据src-tauri/Cargo.toml去下载相关依赖。第二次启动会快很多。

## 构建应用

Tauri Bundler是一个Rust工具，用于编译二进制文件、打包资产并准备最终包，它会检测当前的操作系统并相应地构建一个包。目前支持：

Windows：.msi。

MacOS：.app，.dmg。

Linux：.deb，.appimage。

```bash
yarn tauri build
```

注意：未修改src-tauri/tauri.conf.json中的identifier直接build会报错。需要修改indentifier，例如com.myapp.dev。

build脚本执行完后包会在src-tauri/target/release/bundle/{platform}/{app}下就可以找到应用程序安装包。

# Tauri.conf.json配置

tauri.conf.json是tauri init命令生成的文件，该文件位于Tauri应用程序源目录src-tauri中。可以通过修改它来自定义Tauri应用程序。

## 特定平台配置

除了tauri.conf.json外，Tauri还可以从tauri.linux.conf.json、tauri.windows.conf.json、tauri.macos.conf.json中读取特定于平台的配置，并将其与tauri.conf.json主配置合并。

## 配置结构

### package

Package的设置，主要有1、productName:string?  App名称；2、version:string? 版本号，它是semver版本号或包含version字段的package.json文件的路径。

### tauri

pattern：patternKink，要使用的模式。

windows：WindowConfig[]。

```js
// windowConfig
{
    label: string,// default null，窗口标识
    url: WindowUrl,// default view， windows webview url
    fileDropEnabled: boolean,//default true
    center: boolean,//default false
    x: number,// default null, 
    y: number,// default null
    width: number,//default 800
    height: number,//default 600
    minWidth: number,//
    minHeight: number,//
    maxWidth:number,//
    maxHeight:number,//
    resizable: boolean,// default true
    title: string,// 
    fullscreen:boolean,// 
    foucus: boolean,//
    transparent: boolean,//false macOS需要使用macos-private-api，使用此API，不能上架App Store
    maximized: boolean,// false,
    visible: boolean,// true,
    decorations: boolean,// true, 是否有border或bars
    alwaysOnTop: boolean,//false
    skipTaskbar: boolean,//是否展示在taskbar中
    theme: Theme,// 可选值light或dark
}
```

cli: cliConfig。

```js
{
    description?: string, // 帮助中展示的信息
    longDescription?:string,// 长信息
    beforeHelp?:string, //头信息
    afterHelp?:string,// 尾信息
    args: array,// 
    subcommands: object// 
}
```

bundle: BundleConfig。

```js
//
{
    active: boolean,// false，是否需要bundle应用，不bundle只把可执行文件输出
    targets: BundleTarget,//目前支持["deb","appimage","msi","app","dmg","updater", "all"]
    identifier: string, // 必须，默认null，全局唯一的值，eg：com.tauri.example
    icon: string[],// 应用图标
    resources: array,// null，需要打包的app资源，文件或文件夹，全局通配符也是支持的。
    copyright:string, // null，
    category:string,// null, Business, DeveloperTool, Education, Entertainment, Finance, Game, ActionGame, AdventureGame, ArcadeGame, BoardGame, CardGame, CasinoGame, DiceGame, EducationalGame, FamilyGame, KidsGame, MusicGame, PuzzleGame, RacingGame, RolePlayingGame, SimulationGame, SportsGame, StrategyGame, TriviaGame, WordGame, GraphicsAndDesign, HealthcareAndFitness, Lifestyle, Medical, Music, News, Photography, Productivity, Reference, SocialNetworking, Sports, Travel, Utility, Video, Weather.
    shortDescription:string,// null 
    longDescription: string, // null
    appimage: AppImageConfig,// null, {bundleMediaFramework:boolean//默认false}，这会增加15-35M的文件大小。
    deb: DebConfig, // 
    macOS: MacConfig, // 
    externalBin: array, // 其它的需要包含的二进制文件。会根据平台来查找对应的值。
    windows: WindowsConfig,// 
}
```


## 参考文档

https://www.zhihu.com/column/c_1519079232848785408
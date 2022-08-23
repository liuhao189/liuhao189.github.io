# tauri官方文档阅读

## 安装

第一步是安装rust和系统依赖。注意：只有开发者的机器上需要安装，最终用户不需要安装。

### 设置macOS

1、C语言和macOS开发依赖

```bash
xcode-select --install
```

2、Rust

```bash
curl --proto 'https' -tlsv1.2 https://sh.rustup.rs -sSf | sh
```

该脚本会安装rustup相关工具。

### 升级或卸载

Tauri和它的组件可以通过修改Cargo.toml来升级。或者直接运行cargo upgrade命令来升级。

```bash
# upgrade
cargo upgrade
# update rustup
rustup update
# uninstall rustup
rustup self uninstall
```

### 查看当前版本

```bash
rustc --version
# rustc x.y.z(commitid yyyy-mm-dd)
```

## QuickStart

### HTML，CSS & JS

Tauri是一个使用任意的前端框架和Rust核心来构建桌面应用的框架。每一个App分为两个部分：

1、Rust部分：创建window，并导出原生方法到这些window。

2、前端部分：创建window中的用户界面。

### 创建前端界面

```bash
mkdir ui
touch index.html
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>tauri learn</title>
</head>

<body>
  <h1>Welcome from tauri</h1>
</body>

</html>
```

### 创建Rust项目

每一个Tauri App的核心是Rust程序。Rust程序管理窗口，webview，调用操作系统。这个项目由Cargo管理，Cargo是Rust官方的包管理器。

tauri init命令会生成src-tauri的文件夹。

```bash
src-tauri
  Cargo.toml # Cargo的配置文件
  tauri.conf.json # tauri的配置文件
  src/main.rs # Rust的应用入口文件
  icons # 应用图标
```

```
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

fn main() {
  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

### 调用命令

Tauri允许你调用原生的能力来增强网页的功能。我们称这些为Commands，本质上是可以通过JS调用的Rust函数。

```
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}!",name);
}
```
只是一个加了#[tauri::command]注解的Rust函数。

我们还需要告诉Tauri我们新创建的命令，以便它可以相应地路由。

```
fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

然后，就可以在JS中调用了。我们推荐使用@tauri-apps/api包。如果不使用这个包，需要将withGlobalTauri配置打开。

```html
  <script>
    const invoke = window.__TAURI__.invoke;
    invoke('greet', {
      name: 'World'
    }).then(res => {
      alert(res);
    })
  </script>
```

## 架构

### 多进程模型

早期的GUI应用，一般会使用一个进程来计算，绘制UI，响应用户操作。如果有大量的计算，这会导致用户操作无响应，如果进程出错，整个应用都会崩溃。

现代的应用程序开始在多个进程中运行不同的组件，这可以更好地利用现代多核CPU。我们还可以通过仅向每个进程提供最少量的权限来限制潜在的漏洞利用。

### 核心进程

每一个Tauri应用都有一个核心进程，核心进程做为应用的入口，同时也是唯一一个有所有权限的进程。

核心进程的主要职责是管理窗口，系统菜单，通知等，同时，主进程也管理跨进程之间的通信，允许你在一个地方拦截，过滤和维护跨进程的所有消息。

核心进程一般也会管理全局状态，比如全局设置，DB连接等。

我们选择Rust来实现的原因是Rust在实现内存安全的基础上拥有绝佳的性能表现。


![tauri-core-proces](/note/assets/imgs/tauri-learn/tauri-core-process.png)

### Webview进程

主进程并不直接渲染用户界面。Webview进程使用操作系统提供的WebView库来执行HTML，CSS和JS。

这意味着你可以使用你熟悉的Web技术来开发UI。为了安全性，保密的业务逻辑最好写在主进程中。

Tauri依赖于操作系统的Webview，这意味着运行的Webview的版本会存在差异，在开发时需要确保页面使用的功能兼容大部分Webview。

目前，Tauri在Windows上使用Microsoft Edge WebView2，MacOS上使用WKWebview，Linux上使用webkitgtk。

## 进程间通信

进程间通信允许孤立的进程之间安全地通信，是构建复杂应用的关键点。

Tauri使用一种称为异步消息传递的特定进程间通信风格，使用一些简单的数据表示形式交换请求和序列化响应。

消息传递是一种比共享内存或直接函数访问更安全的技术，因为接收者可以自由得拒绝或丢弃它认为合适的请求。

### 进程间通信-Events

事件是即发即弃的单向IPC消息，最适合传达生命周期事件和状态更改。

### 进程间通信-Command

Tauri在IPC消息之上提供了一个类似外部函数接口的抽象。基础的API，invoke，有点向浏览器的fetch API，允许前端来调用Rust方法，传递参数，接收数据。

由于机制在后台使用类似JSON-RPC的协议来序列化请求和响应，因此所有参数和返回数据都必须可序列化为JSON。

## Brownfield模式

这是默认的模式，该模式下假设除了现有Web前端可能在浏览器中使用的内容之外，不需要任何其它内容。

### 不兼容性

首先，任何在特定浏览器才有的API，可能会工作的不正常。如果该API没有被广泛支持，应该尽量避免使用该API。

第二种不兼容的是，计划添加到Tauri中，但目前还没实现的。eg：Linux上的WebRTC；一些Permissions APIS；Download Links/Blob as URL；Better i18n。

### 配置

```json
{
  tauri: {
    pattern: {
      use: "brownfield"
    }
  }
}
```
## Isolation模式

隔离模式是一种在前端发送到Tauri Core之前拦截和修改Tauri API消息的方法，所有这些是由JS进行的。由隔离模式注入的安全JS代码称为隔离应用程序。

### 为什么

隔离模式的目的是为开发人员提供一种机制，以帮助其应用程序免受对Tauri Core的不需要的或恶意的前端调用。这是具有很多依赖项的应用程序的常见情况。

### 什么时候使用

tauri强烈推荐在可以使用时尽量使用隔离模式。Tauri还强烈建议您在使用外部Tauri API时锁定您的应用程序。作为开发人员，您可以利用安全隔离应用程序尝试验证IPC输入，已确保它们在预期的参数范围内。

### 怎样实现

隔离模式就是在前端和Tauri Core之间注入一个安全的应用程序，以拦截和修改传入的IPC消息。它通过沙盒的iframe与主前端应用程序一起安全地运行JS来实现此目的。

Tauri在加载页面时强制执行隔离模式，强制前端应用的IPC调用首先会通过隔离模式下iframe页面，然后再调用到Tauri Core。

一旦确认消息可以发送到Tauri Core，隔离模式下iframe会使用SubtleCrypto来加密消息并发送会主前端页面，然后发送到Tauri Core，消息会在Tauri Core里解密。

为了确保没有中间人攻击，每次应用程序运行时都会生成新的Key。

### IPC消息的大致流程

1、Tauri-IPC处理器接收消息。

2、IPC-handler传递到Isolation应用。

3、sandbox-isolation应用检查和修改消息。

4、sandbox使用运行时生成的key用AES-GCM加密。

5、加密后的消息由Isolation Application发送到IPC handler。

6、加密后的消息由IPC handler发送到Tauri Core。

## 性能影响

即使Isolation Application不做任何事，因为会加密消息，所有会带来一定的性能损耗。

除了对性能敏感的应用程序(为了保持性能足够，它们可能具有精心维护的小型依赖项)之外，大多数应用不应该关注到这块的运行时消耗。

## 限制

隔离模式下有一些因为平台不一致而引起的限制。最重要的限制是在windows系统中，外部文件无法在沙盒的iframe正确加载。

因为这个，我们在编译时将脚本的内容下载下来，并将脚本内容inline到script标签中。

## 建议

由于隔离应用程序的目的是防范开发威胁，因此我们强烈建议使隔离应用程序尽可能简单。这需要尽可能少得引入依赖，同时需要更加仔细地识别依赖。

## 创建Isolation应用

首先配置tauri.conf.json。

```json
{
  "tauri": {
    "pattern": {
      "use": "isolation",
      "options": {
        "dir": "../dist-isolation"
      }
    }
  }
}
```

然后，创建dist-isolation/index.html。

```html
<body>
  <script src="index.js"></script>
</body>
```

创建dist-isolation/index.js。

```js
window.__TAURI_ISOLATION_HOOK__ = (payload) => {
  console.log('hook', payload);
  return payload;
}
```

## 从前端调用Rust

Tauri提供了强大的command系统来让前端调用Rust。Command可以接受参数并返回值，它们还可以返回错误并且是async。

### 基本例子

命令可以在src-tauri/src/main.rs文件中定义。

```
#[tauri::command]
fn my_custom_command() {
  println!("I was invoked from JS!")
}
```

需要将command列表传给builder函数。

```
fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![my_custom_command])
  .run(tauri::generate_context!())
  .expect("failed to run app")
}
```

```js
//npm package
import { invoke } from '@tauri-apps/api/tauri'
//global
const invoke = window.__TAURI.invoke
invoke('my_custom_command')
```

传递参数

```
#[tauri::command]
fn my_custom_command(invoke_message:String) {
  println!("I was invoked from JS, with this message:{}", invoke_message);
}
```

```js
invoke('my_custom_command', {invokeMessage:'Hello!'})
```

返回值

```
#[tauri::command]
fn my_custom_command() -> String {
  "Hello from Rust!".into();
}
```

```js
invoke('my_custom_command').then(msg => { console.log(msg); })
```

错误处理

```
#[tauri::command]
fn my_custom_command() -> Result<String,String> {
  Err("This failed!".into());
  // if it works
  Ok("This Worked!".into());
}
```

```js
//error Promise rejected
invoke("my_custom_command").then(msg=>{ console.log(msg); })
  .catch(err => {
    console.error(err);
  })
```

## Async Commands

Async的command使用async_runtime::spawn运行在独立的线程中，没有async关键值的Command运行在主线程，除非有#[tauri::command(async)]声明。

```
#[tauri::command]
async fn my_custom_command() {
  let result = some_async_function.await;
  println!("Result: {}", result);
}
```

## Commands中访问Window

Commands可以访问Window实例。

```
#[tauri::command]
async fn my_custom_command(window: tauri::Window) {
  println!("Window: {}",window.label())
}
```

## Command中访问AppHandler

```
#[tauri::command]
async fn my_apphandler(app_handler: tauri::AppHandle){
  let app_dir = app_handler.path_resolver().app_dir();
  use tauri::GlobalShortcurManager;
  app_handler.global_shotcur_manager().resister('CTRL + U',move || {});
}
```

## Events

Tauri的事件系统是多生产者多消费者的，允许消息在前端和后端相互传递的事件系统，它类似于命令系统，它简化了从后端到前端的通信，就像管道一样工作。

一个Tauri应用可以监听和触发全局或指定窗口的事件。

### 前端

#### 全局事件

引入event模块中的emit和listen方法。

```js
import { emit,listen } from '@tauri-apps/api/event';
const unlisten = await listen('click',(ev)=>{
  console.log(ev.event);//eventName
  console.log(ev.payload);// payload
});

//
emit('click',{
  theMessage: 'Tauri is awesome!'
});
```

#### 指定window的事件

```js
import { appWindow, WebviewWindow } from '@tauri-apps/api/window';
// only visible to the current window
appWindow.emit('event', { message: 'Tauri is awesome!' });

const webView = new WebviewWindow('window');
// only to the new window
webView.emit('event');
```

### 后端

全局事件通道暴露在app的结构上。

```
use tauri::Manager;
//payload type should implement Serialize and Clone
#[derive(Clone,serde::Serialize)]
struct Payload {
  message: String;
}

tauri::Builder::default()
  .setup(|app| {
    let id = app.listen_global("event-name",|event| {
      println!("got event-name with payload {:?}", event.payload());
    });
    // app.unlisten(id)
    app.emit_all("event-name",Payload { message:"Tauri is awesome!".into() }).unwrap();
    Ok(());
  })
```

### 指定window的事件

window对象可以通过command handler或get_window方法来获取。

```
//只在调用该命令的窗口触发周期事件
#[tauri::command]
fn init_process(window: Window) {
  std::thread::spawn(move || {
    loop {
      window.emit("event-name", Payload { message: "Tauri is awesome!".into() }).unwrap();
    }
  });
}
//
.setup(|app| {
  let main_window = app.get_window("main").unwrap();
  main_window.listen("event-name", |event| {
    println!("got window event-name with payload {:?}",event.payload());
  });

  main_window.emit("event_name", Payload { message: "Tauri is awesome!".into() }).unwrap();
```

### 多窗口

#### 创建窗口

窗口可以在Tauri配置文件或运行时创建。

#### 静态窗口

tauri::windows配置是个数组即可。

```json
  {
    "label": "external",
    "title": "lingxi-office",
    "url": "https://lingxi.office.163.com"
  }
```

注意：window的label必须是全局唯一的，因为在运行时需要用label来获取窗口实例。

### 运行时创建窗口

你可以使用Rust层或Tauri API层来在运行时创建窗口。

#### 在Rust中创建窗口

使用WindowBuilder结构来创建窗口，你需要持有一个运行中的App或AppHandle实例。



## 参考文档

https://tauri.app/v1/guides/getting-started/prerequisites
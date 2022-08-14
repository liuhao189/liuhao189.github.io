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


## 参考文档

https://tauri.app/v1/guides/getting-started/prerequisites